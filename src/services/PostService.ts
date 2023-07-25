import { COLLECTIONS } from "../db/db";
import { Post, DeSerializedPost, SerializedPost } from "../models/Post";
import { BaseService } from "./BaseService";

export default class PostService extends BaseService<Post> {
  constructor() {
    super(COLLECTIONS.POSTS, Post);
  }

  public deserialize(model): DeSerializedPost {
    const { id, cookbook, user, body, tags } = model;
    return {
      _id: id,
      cookbook,
      user: user,
      body,
      tags,
    };
  }

  public serialize(document): SerializedPost {
    const { _id, cookbook, user, body, tags } = document;
    return {
      id: _id,
      cookbook,
      user,
      body,
      tags,
    };
  }
}
