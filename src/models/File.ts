import { ObjectId } from "mongodb";
import { BaseModel } from "./BaseModel";

export interface DeSerializedFile {
  _id?: ObjectId;
  cookbook: ObjectId;
  gfy_id?: string;
  urls: {
    gif?: string;
    mp4?: string;
  };
}

export interface SerializedFile {
  id?: ObjectId;
  cookbook: ObjectId;
  gfyId?: string;
  urls: {
    gif?: string;
    mp4?: string;
  };
}

export interface SanitizedFile {
  id: ObjectId;
  urls: {
    gif?: string;
    mp4?: string;
  };
}

export class File extends BaseModel {
  public id: ObjectId | undefined;
  public cookbook: ObjectId;
  public gfyId?: string;
  public urls: {
    gif?: string;
    mp4?: string;
  };

  constructor({ id, cookbook, gfyId, urls }: SerializedFile) {
    super();
    this.id = id;
    this.cookbook = cookbook;
    this.gfyId = gfyId;
    this.urls = urls;
  }

  public sanitize(): SanitizedFile {
    return {
      id: this.id,
      urls: this.urls,
    };
  }
}
