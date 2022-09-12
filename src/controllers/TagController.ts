import { ROUTES } from "../constants/Constants";
import { cookbookAuth } from "../middleware/Auth";
import { SerializedTag, Tag } from "../models/Tag";
import TagService from "../services/TagService";
import { BaseController } from "./BaseController";

export class TagController extends BaseController<Tag, SerializedTag> {
  constructor() {
    super(Tag, new TagService(), ROUTES.TAGS);
  }

  @cookbookAuth()
  async create(req, res) {
    super.create(req, res);
  }

  @cookbookAuth()
  async deleteOne(req, res) {
    super.deleteOne(req, res);
  }

  @cookbookAuth()
  async update(req, res) {
    super.update(req, res);
  }
}
