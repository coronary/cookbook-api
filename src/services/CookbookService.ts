import { getAndPopulateCookbooks } from "../db/aggregates/cookbook";
import { COLLECTIONS } from "../db/db";
import {
  Cookbook,
  DeSerializedCookbook,
  SerializedCookbook,
} from "../models/Cookbook";
import { BaseService } from "./BaseService";

export default class CookbookService extends BaseService<Cookbook> {
  constructor() {
    super(COLLECTIONS.COOKBOOKS, Cookbook);
  }

  async getPopulatedCookbook(cookbookName: string): Promise<Cookbook> {
    const documents = await getAndPopulateCookbooks(cookbookName);

    if (documents == null) {
      throw new Error("Documents Not Found");
    }

    const document = documents[0];

    return new Cookbook({ ...this.serialize(document) });
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
