import { COLLECTIONS } from "../db/db";
import { Post, DeSerializedPost, SerializedPost } from "../models/Post";
import { BaseService } from "./BaseService";

export default class PostService extends BaseService<Post> {
  constructor() {
    super(COLLECTIONS.GUIDES, Post);
  }

  public deserialize(document): DeSerializedPost {
    const { user, body, tags } = document;
    return {
      user: user,
      body,
      tags,
    };
  }

  public serialize(document): SerializedPost {
    const { _id, user, body, tags } = document;
    return {
      id: _id,
      user,
      body,
      tags,
    };
  }
}
