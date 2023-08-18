import { getSectionFromNames } from "../db/aggregates/section";
import { COLLECTIONS } from "../db/db";
import {
  Section,
  DeSerializedSection,
  SerializedSection,
} from "../models/Section";
import { BaseService } from "./BaseService";

export default class SectionService extends BaseService<Section> {
  constructor() {
    super(COLLECTIONS.SECTIONS, Section);
  }

  async getSectionFromNames(
    cookbookName: string,
    guideName: string,
    sectionName: string
  ): Promise<Section> {
    const document = await getSectionFromNames(
      cookbookName,
      guideName,
      sectionName
    );

    if (document == null) {
      throw new Error("Documents Not Found");
    }

    return new Section({ ...this.serialize(document) });
  }

  public deserialize(model): DeSerializedSection {
    const { id, cookbook, guide, name, body } = model;
    return {
      _id: id,
      cookbook,
      guide,
      name: name,
      body,
    };
  }

  public serialize(document): SerializedSection {
    const { _id, cookbook, guide, name, body } = document;
    return {
      id: _id,
      cookbook,
      guide,
      name,
      body,
    };
  }
}
