import RedisCache, { Caches } from "../db/RedisCache";
import { getAndPopulateCookbooks } from "../db/aggregates/cookbook";
import { COLLECTIONS } from "../db/db";
import { parseObjectIds } from "../middleware/QueryStrings";
import {
  Cookbook,
  DeSerializedCookbook,
  SerializedCookbook,
} from "../models/Cookbook";
import { Guide } from "../models/Guide";
import { Section } from "../models/Section";
import { BaseService } from "./BaseService";
import GuideService from "./GuideService";
import SectionService from "./SectionService";

export default class CookbookService extends BaseService<Cookbook> {
  constructor() {
    super(COLLECTIONS.COOKBOOKS, Cookbook);
  }

  async getPopulatedCookbook(cookbookName: string): Promise<Cookbook> {
    const documents = await getAndPopulateCookbooks(cookbookName);

    if (documents == null) {
      throw new Error("Documents Not Found");
    }

    const sectionService = new SectionService();
    const guideService = new GuideService();
    const document = documents[0];
    document.guides = document.guides.map((guide) => {
      const _guide: Guide = new Guide({ ...guideService.serialize(guide) });
      _guide.sections = _guide.sections.map(
        (section) => new Section({ ...sectionService.serialize(section) })
      );
      return _guide;
    });

    return new Cookbook({ ...this.serialize(document) });
  }

  async save(model: Cookbook) {
    await RedisCache.delete(Caches.COOKBOOK(model.name));
    parseObjectIds(model);
    return await super.save(model);
  }

  public deserialize(model): DeSerializedCookbook {
    const {
      id,
      game,
      name,
      streams,
      roles,
      preview,
      guides,
      bannerUrl,
      avatarUrl,
    } = model;
    return {
      _id: id,
      game,
      name,
      streams,
      roles,
      preview,
      guides,
      banner_url: bannerUrl,
      avatar_url: avatarUrl,
    };
  }

  public serialize(document): SerializedCookbook {
    const {
      _id,
      game,
      name,
      streams,
      roles,
      preview,
      guides,
      banner_url,
      avatar_url,
    } = document;
    return {
      id: _id,
      game,
      name,
      streams,
      roles,
      preview,
      guides,
      bannerUrl: banner_url,
      avatarUrl: avatar_url,
    };
  }
}
