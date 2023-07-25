import { ROUTES } from "../constants/Constants";
import { Guide } from "../models/Guide";
import GuideService from "../services/GuideService";
import { CookbookBaseController } from "./CookbookBaseController";

export class GuideController extends CookbookBaseController<Guide> {
  constructor(guideService: GuideService) {
    super(Guide, guideService, ROUTES.GUIDES);
  }

  public static inject = ["guideService"] as const;
}
