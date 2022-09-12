import { ROUTES } from "../constants/Constants";
import { cookbookAuth } from "../middleware/Auth";
import { Guide, SerializedGuide } from "../models/Guide";
import GuideService from "../services/GuideService";
import { BaseController } from "./BaseController";

export class GuideController extends BaseController<Guide, SerializedGuide> {
  constructor(guideService: GuideService) {
    super(Guide, guideService, ROUTES.GUIDES);
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

  public static inject = ["guideService"] as const;
}
