import { ObjectId } from "mongodb";
import { BaseModel } from "./BaseModel";

export interface DeSerializedSection {
  _id?: ObjectId;
  cookbook: ObjectId;
  name: string;
  body: string;
}

export interface SerializedSection {
  id?: ObjectId;
  cookbook: ObjectId;
  name: string;
  body: string;
}

export interface SanitizedSection {
  id: ObjectId;
  cookbook: ObjectId;
  name: string;
  body: string;
}

export class Section extends BaseModel {
  public id: ObjectId | undefined;
  public cookbook: ObjectId;
  public name: string;
  public body: string;

  constructor({ id, cookbook, name, body }: SerializedSection) {
    super();
    this.id = id;
    this.cookbook = cookbook;
    this.name = name;
    this.body = body;
  }

  public sanitize(): SanitizedSection {
    return {
      id: this.id,
      cookbook: this.cookbook,
      name: this.name,
      body: this.body,
    };
  }
}
