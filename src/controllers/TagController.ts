import { ROUTES } from "../constants/Constants";
import { Tag } from "../models/Tag";
import TagService from "../services/TagService";
import { CookbookBaseController } from "./CookbookBaseController";

export class TagController extends CookbookBaseController<Tag> {
  constructor(tagService: TagService) {
    super(Tag, tagService, ROUTES.TAGS);
  }

  public static inject = ["tagService"] as const;
}
