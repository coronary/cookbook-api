import { COLLECTIONS } from "../db/db";
import { Tag, DeSerializedTag, SerializedTag } from "../models/Tag";
import { BaseService } from "./BaseService";

export default class TagService extends BaseService<Tag> {
  constructor() {
    super(COLLECTIONS.GUIDES, Tag);
  }

  public deserialize(model): DeSerializedTag {
    const { id, name, cookbook, color } = model;
    return {
      _id: id,
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
