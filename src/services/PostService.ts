import { ObjectId } from "mongodb";
import { Population } from "../db/aggregates/AggregationBuilder";
import { AggregationDirector } from "../db/aggregates/AggregationDirector";
import { COLLECTIONS } from "../db/db";
import { DeSerializedPost, Post, SerializedPost } from "../models/Post";
import { isTag, Tag } from "../models/Tag";
import { isUser, User } from "../models/User";
import { BaseService } from "./BaseService";
import TagService from "./TagService";
import UserService from "./UserService";

const TAG_FILTER_FIELD = "tags.name";
const SEARCH_FIELDS = ["body", "tags.name"];
const POPULATE_FIELDS: Population[] = [
  { field: "user", fromCollection: "users", unwind: true },
  { field: "tags", fromCollection: "tags" },
];

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
    const { sort, skip, limit } = options;

    const filterFields = tags != null && tags.length > 0
      ? [{ name: TAG_FILTER_FIELD, values: tags }]
      : undefined;

    const aggregationDirector = new AggregationDirector(this.collection)
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(POPULATE_FIELDS)
      .search(searchString, SEARCH_FIELDS, filterFields);

    const documents = await aggregationDirector.build().aggregateMany();

    if (documents == null) {
      throw new Error("Documents Not Found");
    }

    const userService = new UserService();
    const tagService = new TagService();

    return documents.map((d) => {
      // user model
      d.user = new User(userService.serialize({ ...d.user }));

      // tag models
      d.tags = d.tags.map((tag) => new Tag(tagService.serialize({ ...tag })));

      return new this.type({ ...this.serialize(d) });
    });
  }

  async save(model: Post) {
    model.cookbook = new ObjectId(model.cookbook);
    model.user = isUser(model.user) ? new ObjectId(model.user.id) : model.user;
    model.tags = model.tags.map((t) => isTag(t) ? new ObjectId(t.id) : t);
    return await super.save(model);
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
