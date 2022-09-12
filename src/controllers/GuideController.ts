import { ROUTES } from "../constants/Constants";
import { auth } from "../middleware/Auth";
import { Guide } from "../models/Guide";
import GuideService from "../services/GuideService";
import { BaseController } from "./BaseController";

export class GuideController extends BaseController<Guide> {
  constructor() {
    super(Guide, new GuideService(), ROUTES.GUIDES);
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
