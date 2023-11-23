import { AppInjector } from "../app";
import { ROUTES } from "../constants/Constants";
import { cookbookId } from "../middleware/CookbookId";
import { tryCatch } from "../middleware/ErrorHandler";
import { Cookbook } from "../models/Cookbook";
import { Guide } from "../models/Guide";
import CookbookService from "../services/CookbookService";
import GuideService from "../services/GuideService";
import { CookbookBaseController } from "./CookbookBaseController";
import { SectionController } from "./SectionController";

export class GuideController extends CookbookBaseController<Guide> {
  constructor(
    private guideService: GuideService,
    private cookbookService: CookbookService
  ) {
    super(Guide, guideService, ROUTES.GUIDES);
  }

  setChildRoutes() {
    const sectionController = AppInjector.injectClass(SectionController);
    this.router.use(this.buildRoute(ROUTES.SECTIONS), sectionController.router);
  }

  private buildRoute(route) {
    return `${this.detailRoute()}/${route}`;
  }

  @tryCatch()
  @cookbookId()
  async create(req, res, next) {
    const { body } = req;
    const { name, cookbook: cookbookId } = body;

    if (name == null) {
      throw new Error("must provide name");
    }

    const guideModel = new Guide({
      name,
      cookbook: cookbookId,
    });

    const guide = await this.guideService.save(guideModel);
    const cookbook = await this.cookbookService.getById(cookbookId);
    const cookbookModel: Cookbook = new Cookbook({
      ...cookbook,
      guides: [...cookbook.guides, guide.id],
    });
    await this.cookbookService.save(cookbookModel);
    res.send(guide.sanitize());
  }

  public static inject = ["guideService", "cookbookService"] as const;
}
