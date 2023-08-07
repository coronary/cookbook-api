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
