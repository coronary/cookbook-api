import { ObjectId } from "mongodb";
import { BaseModel } from "./BaseModel";

export interface DeSerializedTag {
  _id?: ObjectId;
  name: string;
  cookbook: ObjectId;
  color?: string;
}

export interface SerializedTag {
  id?: ObjectId;
  name: string;
  cookbook: ObjectId;
  color?: string;
}

export interface SanitizedTag {
  id: ObjectId;
  name: string;
  cookbook: ObjectId;
  color?: string;
}

export class Tag extends BaseModel {
  public id: ObjectId | undefined;
  public name: string;
  public cookbook: ObjectId;
  public color: string | null | undefined;

  constructor({ id, name, cookbook, color }: SerializedTag) {
    super();
    this.id = id;
    this.name = name;
    this.cookbook = cookbook;
    this.color = color;
  }

  public serialize(): SanitizedTag {
    return {
      id: this.id,
      name: this.name,
      cookbook: this.cookbook,
      color: this.color,
    };
  }
}
