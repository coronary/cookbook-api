import { ObjectId } from "mongodb";
import { BaseModel } from "./BaseModel";
import { SanitizedUser, User, isUser } from "./User";
import { SanitizedTag, SerializedTag, Tag, isTag } from "./Tag";

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
  user: ObjectId | SanitizedUser;
  body: string;
  tags: Array<ObjectId | SanitizedTag>;
}

export class Post extends BaseModel {
  public id: ObjectId | undefined;
  public cookbook: ObjectId;
  public user: ObjectId | User;
  public body: string;
  public tags: Array<ObjectId | Tag>;

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
      user: isUser(this.user) ? this.user?.sanitize() : this.user,
      body: this.body,
      tags: this.tags.map((tag) => (isTag(tag) ? tag?.sanitize() : tag)),
    };
  }
}
