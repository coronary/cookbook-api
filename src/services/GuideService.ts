import { COLLECTIONS } from "../db/db";
import { Guide, DeSerializedGuide, SerializedGuide } from "../models/Guide";
import { BaseService } from "./BaseService";

export default class GuideService extends BaseService<Guide> {
  constructor() {
    super(COLLECTIONS.GUIDES, Guide);
  }

  public deserialize(model): DeSerializedGuide {
    const { id, name, cookbook, sections } = model;
    return {
      _id: id,
      name: name,
      cookbook,
      sections,
    };
  }

  public serialize(document): SerializedGuide {
    const { _id, name, cookbook, sections } = document;
    return {
      id: _id,
      name,
      cookbook,
      sections,
    };
  }
}
