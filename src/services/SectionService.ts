import { getSectionFromNames } from "../db/aggregates/section";
import { COLLECTIONS } from "../db/db";
import RedisCache, { Caches } from "../db/RedisCache";
import {
  DeSerializedSection,
  Section,
  SerializedSection,
} from "../models/Section";
import { BaseService } from "./BaseService";
import CookbookService from "./CookbookService";

export default class SectionService extends BaseService<Section> {
  constructor() {
    super(COLLECTIONS.SECTIONS, Section);
  }

  async save(model: Section) {
    const cookbookService = new CookbookService();
    const cookbook = await cookbookService.getById(model.cookbook);
    await RedisCache.delete(Caches.COOKBOOK(cookbook.name));
    return await super.save(model);
  }

  async getSectionFromNames(
    cookbookName: string,
    guideName: string,
    sectionName: string,
  ): Promise<Section> {
    const documents = await getSectionFromNames(
      cookbookName,
      guideName,
      sectionName,
    );

    if (documents == null || documents.length < 1) {
      throw new Error("Documents Not Found");
    }

    return new Section({ ...this.serialize(documents[0]) });
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
