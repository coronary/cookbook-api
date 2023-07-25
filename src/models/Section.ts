import { ObjectId } from "mongodb";
import { BaseModel } from "./BaseModel";

export interface DeSerializedSection {
  _id?: ObjectId;
  name: string;
  body: string;
}

export interface SerializedSection {
  id?: ObjectId;
  name: string;
  body: string;
}

export interface SanitizedSection {
  id: ObjectId;
  name: string;
  body: string;
}

export class Section extends BaseModel {
  public id: ObjectId | undefined;
  public name: string;
  public body: string;

  constructor({ id, name, body }: SerializedSection) {
    super();
    this.id = id;
    this.name = name;
    this.body = body;
  }

  public serialize(): SanitizedSection {
    return {
      id: this.id,
      name: this.name,
      body: this.body,
    };
  }
}
