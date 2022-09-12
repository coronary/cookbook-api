import { ROUTES } from "../constants/Constants";
import { Guide, SerializedGuide } from "../models/Guide";
import GuideService from "../services/GuideService";
import { CookbookBaseController } from "./CookbookBaseController";

export class GuideController extends CookbookBaseController<
  Guide,
  SerializedGuide
> {
  constructor(guideService: GuideService) {
    super(Guide, guideService, ROUTES.GUIDES);
  }

  public static inject = ["guideService"] as const;
}
