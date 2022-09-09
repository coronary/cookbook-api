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

  public deserialize(document): DeSerializedCookbook {
    const { name, streams, roles, preview, guides, bannerUrl, avatarUrl } =
      document;
    return {
      name: name,
      streams: streams,
      roles: roles,
      preview: preview,
      guides: guides,
      banner_url: bannerUrl,
      avatar_url: avatarUrl,
    };
  }

  public serialize(document): SerializedCookbook {
    const { _id, name, streams, roles, preview, guides, banner_url } = document;
    return {
      id: _id,
      name: name,
      streams: streams,
      roles: roles,
      preview: preview,
      guides: guides,
      bannerUrl: banner_url,
    };
  }
}
