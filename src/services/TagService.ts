import { COLLECTIONS } from "../db/db";
import { Tag, DeSerializedTag, SerializedTag } from "../models/Tag";
import { BaseService } from "./BaseService";

export default class TagService extends BaseService<Tag> {
  constructor() {
    super(COLLECTIONS.GUIDES, Tag);
  }

  public deserialize(document): DeSerializedTag {
    const { name, cookbook, color } = document;
    return {
      name: name,
      cookbook,
      color,
    };
  }

  public serialize(document): SerializedTag {
    const { _id, name, cookbook, color } = document;
    return {
      id: _id,
      name,
      cookbook,
      color,
    };
  }
}
