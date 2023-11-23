import { ObjectId } from "mongodb";
import { BaseModel } from "./BaseModel";

export interface DeSerializedSection {
  _id: ObjectId;
  cookbook: ObjectId;
  guide: ObjectId;
  name: string;
  body: string;
}

export interface SerializedSection {
  id: ObjectId;
  cookbook: ObjectId;
  guide: ObjectId;
  name: string;
  body: string;
}

export interface SanitizedSection {
  id: ObjectId;
  cookbook: ObjectId;
  guide: ObjectId;
  name: string;
  body: string;
}

export function isSection(object: any): object is Section {
  const { id, name, cookbook, guide, body } = object;
  return (
    id !== undefined &&
    name !== undefined &&
    cookbook !== undefined &&
    guide !== undefined &&
    body !== undefined
  );
}

export class Section extends BaseModel {
  public id: ObjectId;
  public cookbook: ObjectId;
  public guide: ObjectId;
  public name: string;
  public body: string;

  constructor({ id, cookbook, guide, name, body }: Partial<SerializedSection>) {
    super();
    this.id = id;
    this.cookbook = cookbook;
    this.guide = guide;
    this.name = name;
    this.body = body;
  }

  public sanitize(): SanitizedSection {
    return {
      id: this.id,
      cookbook: this.cookbook,
      guide: this.guide,
      name: this.name,
      body: this.body,
    };
  }
}
