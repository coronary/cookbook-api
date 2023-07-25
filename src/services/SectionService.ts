import { COLLECTIONS } from "../db/db";
import {
  Section,
  DeSerializedSection,
  SerializedSection,
} from "../models/Section";
import { BaseService } from "./BaseService";

export default class SectionService extends BaseService<Section> {
  constructor() {
    super(COLLECTIONS.GUIDES, Section);
  }

  public deserialize(model): DeSerializedSection {
    const { id, cookbook, name, body } = model;
    return {
      _id: id,
      cookbook,
      name: name,
      body,
    };
  }

  public serialize(document): SerializedSection {
    const { _id, cookbook, name, body } = document;
    return {
      id: _id,
      cookbook,
      name,
      body,
    };
  }
}
