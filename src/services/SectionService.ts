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

  public deserialize(document): DeSerializedSection {
    const { name, body, tags } = document;
    return {
      name: name,
      body,
      tags,
    };
  }

  public serialize(document): SerializedSection {
    const { _id, name, body, tags } = document;
    return {
      id: _id,
      name,
      body,
      tags,
    };
  }
}
