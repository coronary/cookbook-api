import { AppInjector } from "../app";
import { getAndPopulate } from "../db/aggregates/populate";
import { COLLECTIONS } from "../db/db";
import { Post, DeSerializedPost, SerializedPost } from "../models/Post";
import { Tag } from "../models/Tag";
import { User } from "../models/User";
import { BaseService } from "./BaseService";
import TagService from "./TagService";
import UserService from "./UserService";

const POPULATE_FIELDS = [
  { field: "user", collection: "users", unwind: true },
  { field: "tags", collection: "tags" },
];

const SEARCH_FIELDS = ["body", "tags.name"];

function parseTags(s: string) {
  if (s == null) return { search: undefined, tags: undefined };
  const tags = [...s.matchAll(/#[^\s]+/g)].map((tag) =>
    tag[0].replace("#", "")
  );
  const search = s.replace(/#[^\s]+/g, "").trim();
  return { search, tags };
}

export default class PostService extends BaseService<Post> {
  constructor() {
    super(COLLECTIONS.POSTS, Post);
  }

  public async get(filter?, options?, search?): Promise<Array<Post>> {
    const { search: searchString, tags } = parseTags(search);

    const documents = await getAndPopulate(
      this.collection,
      filter,
      options,
      searchString,
      {
        populateFields: POPULATE_FIELDS,
        searchFields: SEARCH_FIELDS,
        tags,
      }
    );

    if (documents == null) {
      throw new Error("Documents Not Found");
    }

    return documents.map((d) => {
      // user model
      d.user = new User(
        AppInjector.injectClass(UserService).serialize({ ...d.user })
      );

      // tag models
      d.tags = d.tags.map(
        (tag) =>
          new Tag(AppInjector.injectClass(TagService).serialize({ ...tag }))
      );

      return new this.type({ ...this.serialize(d) });
    });
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
