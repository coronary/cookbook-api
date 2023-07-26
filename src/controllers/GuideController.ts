import { AppInjector } from "../app";
import { ROUTES } from "../constants/Constants";
import { Guide } from "../models/Guide";
import GuideService from "../services/GuideService";
import { CookbookBaseController } from "./CookbookBaseController";
import { SectionController } from "./SectionController";

export class GuideController extends CookbookBaseController<Guide> {
  constructor(guideService: GuideService) {
    super(Guide, guideService, ROUTES.GUIDES);
  }

  setChildRoutes() {
    const sectionController = AppInjector.injectClass(SectionController);
    this.router.use(this.buildRoute(ROUTES.SECTIONS), sectionController.router);
  }

  private buildRoute(route) {
    return `${this.detailRoute()}/${route}`;
  }

  public static inject = ["guideService"] as const;
}
