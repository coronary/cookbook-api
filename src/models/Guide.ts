import { ObjectId } from "mongodb";
import { BaseModel } from "./BaseModel";
import { Section, isSection } from "./Section";

export interface DeSerializedGuide {
  _id: ObjectId;
  name: string;
  cookbook: ObjectId;
  sections: ObjectId[];
}

export interface SerializedGuide {
  id: ObjectId;
  name: string;
  cookbook: ObjectId;
  sections: ObjectId[] | Section[];
}

export interface SanitizedGuide {
  id: ObjectId;
  name: string;
  cookbook: ObjectId;
  sections: ObjectId[] | Section[];
}

export function isGuide(object: any): object is Guide {
  const { id, name, cookbook, sections } = object;
  return (
    id !== undefined &&
    name !== undefined &&
    cookbook !== undefined &&
    sections !== undefined
  );
}

export class Guide extends BaseModel {
  public id: ObjectId;
  public name: string;
  public cookbook: ObjectId;
  public sections: ObjectId[] | Section[];

  constructor({ id, name, cookbook, sections = [] }: Partial<SerializedGuide>) {
    super();
    this.id = id;
    this.name = name;
    this.cookbook = cookbook;
    this.sections = sections;
  }

  public sanitize(): SanitizedGuide {
    return {
      id: this.id,
      name: this.name,
      cookbook: this.cookbook,
      sections: this.sections.map((section) =>
        isSection(section) ? section?.sanitize() : section
      ),
    };
  }
}
