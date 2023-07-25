import { COLLECTIONS, get } from "../db/db";
import { DeSerializedUser, SerializedUser, User } from "../models/User";
import { BaseService } from "./BaseService";

export default class UserService extends BaseService<User> {
  constructor() {
    super(COLLECTIONS.USERS, User);
  }

  public async getByDiscordId(discordId: string) {
    const documents = await get(this.collection, { discord_id: discordId });

    if (documents == null) {
      throw new Error("Documents Not Found");
    }

    return new this.type({ ...this.serialize(documents[0]) });
  }

  public deserialize(model): DeSerializedUser {
    const {
      id,
      discordId,
      discordUsername,
      discordAvatar,
      socialLinks,
      superAdmin,
    } = model;

    const deserilizedUser: DeSerializedUser = {
      _id: id,
      discord_id: discordId,
      discord_username: discordUsername,
      discord_avatar: discordAvatar,
      social_links: socialLinks,
    };

    if (superAdmin != null) {
      deserilizedUser.super_admin = superAdmin;
    }

    if (socialLinks != null) {
      deserilizedUser.social_links = socialLinks;
    }

    return deserilizedUser;
  }

  public serialize(document): SerializedUser {
    const {
      _id,
      discord_id,
      discord_username,
      discord_avatar,
      social_links,
      super_admin,
    } = document;
    return {
      id: _id,
      discordId: discord_id,
      discordUsername: discord_username,
      discordAvatar: discord_avatar,
      socialLinks: social_links,
      superAdmin: super_admin,
    };
  }
}
