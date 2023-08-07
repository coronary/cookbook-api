import { ObjectId } from "mongodb";
import { BaseModel } from "./BaseModel";
import SectionService from "../services/SectionService";
import { AppInjector } from "../app";

export interface DeSerializedGuide {
  _id?: ObjectId;
  name: string;
  cookbook: ObjectId;
  sections: ObjectId[];
}

export interface SerializedGuide {
  id?: ObjectId;
  name: string;
  cookbook: ObjectId;
  sections: ObjectId[];
}

export interface SanitizedGuide {
  id: ObjectId;
  name: string;
  cookbook: ObjectId;
  sections: ObjectId[];
}

export class Guide extends BaseModel {
  public id: ObjectId | undefined;
  public name: string;
  public cookbook: ObjectId;
  public sections: ObjectId[];

  constructor({ id, name, cookbook, sections }: SerializedGuide) {
    super();
    this.id = id;
    this.name = name;
    this.cookbook = cookbook;
    this.sections = sections;
  }

  public async populatedSections() {
    const populatedSections = [];

    for (const sectionId in this.sections) {
      const section = await AppInjector.injectClass(SectionService).getById(
        sectionId
      );
      populatedSections.push(section.sanitize());
    }

    return populatedSections;
  }

  public async sanitizeAsync(): Promise<SanitizedGuide> {
    return {
      id: this.id,
      name: this.name,
      cookbook: this.cookbook,
      sections: await this.populatedSections(),
    };
  }

  public sanitize(): SanitizedGuide {
    return {
      id: this.id,
      name: this.name,
      cookbook: this.cookbook,
      sections: this.sections,
    };
  }
}
