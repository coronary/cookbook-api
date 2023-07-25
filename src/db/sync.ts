import axios from "axios";
import { MediaRoutes } from "../constants/Constants";
import { COLLECTIONS, DEPRICATED_COLLECTIONS, get, save } from "./db";
import * as https from "https";
import AWS from "aws-sdk";
import { logger } from "../utils/Logging";

const gfyRegex = /(https:\/\/)(thumbs\.)?(gfycat)[^\s,]*/g;

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
});

export async function syncGames() {
  const depricatedGames = await get(DEPRICATED_COLLECTIONS.GAMES);
  for (const game of depricatedGames) {
    const model = {
      _id: game._id,
      subdomain: game.subdomain,
      name: game.name,
      display_name: game.display_name,
    };
    await save(COLLECTIONS.GAMES, model);
  }
}

export async function syncUsers() {
  const depricatedUsers = await get(DEPRICATED_COLLECTIONS.USERS);
  for (const user of depricatedUsers) {
    const model = {
      _id: user._id,
      discord_username: user.username,
      discord_avatar: user.avatar,
      discord_id: user.discord_id,
      super_admin: user.super_admin,
      social_links: user.links,
    };
    await save(COLLECTIONS.USERS, model);
  }
}

export async function syncCookbooks() {
  const depricatedCookbooks = await get(DEPRICATED_COLLECTIONS.COOKBOOKS);
  const depricatedUsers = await get(DEPRICATED_COLLECTIONS.USERS);

  for (const cookbook of depricatedCookbooks) {
    const model = {
      _id: cookbook._id,
      game: cookbook.game,
      streams: cookbook.streams,
      preview: cookbook.preview,
      guides: cookbook.guides,
      banner_url: cookbook.banner_url,
      avatar_url: MediaRoutes.CHARACTER_ICON("melee", toTitle(cookbook.name)),
      roles: {},
      name: toTitle(cookbook.name),
    };

    const userMap = {};

    for (const user of depricatedUsers) {
      userMap[user.uid] = user;
    }

    for (const uid in cookbook.roles) {
      const role = cookbook.roles[uid];
      const user = userMap[uid];
      if (user == null) continue;
      model.roles[user._id] = role;
    }

    await save(COLLECTIONS.COOKBOOKS, model);
  }
}

export async function syncTags() {
  const depricatedTags = await get(DEPRICATED_COLLECTIONS.TAGS);
  for (const tag of depricatedTags) {
    const model = {
      _id: tag._id,
      name: tag.label,
      cookbook: tag.cookbook,
      color: tag.color,
    };
    await save(COLLECTIONS.TAGS, model);
  }
}

export async function syncGuides() {
  const depricatedGuides = await get(DEPRICATED_COLLECTIONS.GUIDES);
  //const guides = depricatedGuides.slice(0, 5);
  let index = 1;
  for (const guide of depricatedGuides) {
    logger.info(`UPLOADING GUIDE: ${index} / ${depricatedGuides.length}`);

    const guideModel: any = {
      _id: guide._id,
      name: toTitle(guide.title),
      cookbook: guide.cookbook,
    };

    const sections = [];

    for (const section of guide.sections) {
      const sectionModel = {
        name: toTitle(section.title),
        body: await replaceGfy(guide.cookbook, section.body),
      };

      const document = await save(COLLECTIONS.SECTIONS, sectionModel);
      sections.push(document._id);
    }

    guideModel.sections = sections;

    await save(COLLECTIONS.GUIDES, guideModel);
    index++;
  }
}

export async function syncPosts() {
  const depricatedPosts = await get(DEPRICATED_COLLECTIONS.POSTS);
  // const posts = depricatedPosts.slice(0, 10);
  let index = 1;

  for (const post of depricatedPosts) {
    logger.info(`UPLOADING POST: ${index} / ${depricatedPosts.length}`);
    const model: any = {
      _id: post._id,
      user: post.cre_account,
      cookbook: post.cookbook,
      tags: post.tags,
    };

    const body = await replaceGfy(post.cookbook, post.body);
    model.body = body;

    await save(COLLECTIONS.POSTS, model);
    index++;
  }
}

async function replaceAsync(str, regex, asyncFn) {
  const promises: any = [];
  str.replace(regex, (match, ...args) => {
    const promise: any = asyncFn(match, ...args);
    promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

async function replaceGfy(cookbookId, body) {
  return await replaceAsync(body, gfyRegex, uploadAndReplace);

  async function uploadAndReplace(match) {
    const id = match.match(/(?<=gfycat.com\/)[^\s-.\)]+/g)[0];
    try {
      const existingFiles = await get(COLLECTIONS.FILES, {
        gfy_id: id.toLowerCase(),
      });
      if (existingFiles != null && existingFiles.length > 0) {
        const urls = existingFiles[0].urls;
        return urls.mp4 ?? urls.gif;
      }
      const agent = new https.Agent({
        rejectUnauthorized: false,
      });
      const response = await axios.get(
        "https://api.gfycat.com/v1/gfycats/" + id,
        { httpsAgent: agent }
      );
      const contentUrls = response.data.gfyItem.content_urls;
      const isMp4 = contentUrls.mp4 != null;
      const mp4Url = contentUrls.mp4?.url;
      const gifUrl = contentUrls.max5mbGif.url;
      const extension = isMp4 ? ".mp4" : ".gif";

      const fileModel = {
        gfy_id: id.toLowerCase(),
        cookbook: cookbookId,
      };
      const document = await save(COLLECTIONS.FILES, fileModel);
      const documentWithUrls = { ...document, urls: {} };

      documentWithUrls.urls = {
        gif:
          gifUrl != null
            ? `https://media.cookbook.gg/${cookbookId}/${document._id}.gif`
            : null,
        mp4:
          mp4Url != null
            ? `https://media.cookbook.gg/${cookbookId}/${document._id}.mp4`
            : null,
      };

      await save(COLLECTIONS.FILES, documentWithUrls);

      if (mp4Url != null) {
        const response = await axios({
          method: "get",
          url: mp4Url,
          httpsAgent: agent,
          responseType: "arraybuffer",
        });

        const params = {
          Bucket: process.env.S3_BUCKET,
          Key: `${cookbookId}/${document._id}.mp4`,
          Body: response.data,
          ContentType: "video/mp4",
          ContentDisposition: "inline",
        };
        await s3.upload(params).promise();
      }

      if (gifUrl != null) {
        const response = await axios({
          method: "get",
          url: gifUrl,
          httpsAgent: agent,
          responseType: "arraybuffer",
        });

        const params = {
          Bucket: process.env.S3_BUCKET,
          Key: `${cookbookId}/${document._id}.gif`,
          Body: response.data,
          ContentType: "image/gif",
          ContentDisposition: "inline",
        };
        await s3.upload(params).promise();
      }

      return `https://media.cookbook.gg/${cookbookId}/${document._id}${extension}`;
    } catch (err) {
      console.log("🚀 ~ file: sync.ts:163 ~ uploadAndReplace ~ err:", err);
      console.log("Failed to download " + id);
    }
  }
}

function toTitle(s: string) {
  return s
    .replaceAll(/\s/g, "-")
    .replaceAll(/[^a-zA-Z\d-]/g, "")
    .toLowerCase();
}
