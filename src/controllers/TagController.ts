import { ROUTES } from "../constants/Constants";
import { auth } from "../middleware/Auth";
import { Tag } from "../models/Tag";
import TagService from "../services/TagService";
import { BaseController } from "./BaseController";

export class TagController extends BaseController<Tag> {
  constructor() {
    super(Tag, new TagService(), ROUTES.TAGS);
  }

  @auth()
  async create(req, res) {
    super.create(req, res);
  }

  @auth()
  async deleteOne(req, res) {
    super.deleteOne(req, res);
  }

  @auth()
  async update(req, res) {
    super.update(req, res);
  }
}
