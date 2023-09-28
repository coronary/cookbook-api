import { ObjectId } from "mongodb";
import { BaseModel } from "./BaseModel";

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
  sections: ObjectId[];
}

export interface SanitizedGuide {
  id: ObjectId;
  name: string;
  cookbook: ObjectId;
  sections: ObjectId[];
}

export class Guide extends BaseModel {
  public id: ObjectId;
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

  public sanitize(): SanitizedGuide {
    return {
      id: this.id,
      name: this.name,
      cookbook: this.cookbook,
      sections: this.sections,
    };
  }
}
