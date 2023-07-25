import { ObjectId } from "mongodb";
import { BaseModel } from "./BaseModel";

export interface DeSerializedPost {
  _id?: ObjectId;
  cookbook: ObjectId;
  user: ObjectId;
  body: string;
  tags: ObjectId[];
}

export interface SerializedPost {
  id?: ObjectId;
  cookbook: ObjectId;
  user: ObjectId;
  body: string;
  tags: ObjectId[];
}

export interface SanitizedPost {
  id?: ObjectId;
  cookbook: ObjectId;
  user: ObjectId;
  body: string;
  tags: ObjectId[];
}

export class Post extends BaseModel {
  public id: ObjectId | undefined;
  public cookbook: ObjectId;
  public user: ObjectId;
  public body: string;
  public tags: ObjectId[];

  constructor({ id, cookbook, user, body, tags }: SerializedPost) {
    super();
    this.id = id;
    this.cookbook = cookbook;
    this.user = user;
    this.body = body;
    this.tags = tags;
  }

  public sanitize(): SanitizedPost {
    return {
      id: this.id,
      cookbook: this.cookbook,
      user: this.user,
      body: this.body,
      tags: this.tags,
    };
  }
}
