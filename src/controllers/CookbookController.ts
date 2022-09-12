import { AppInjector } from "../app";
import { ROUTES } from "../constants/Constants";
import { cookbookAuth } from "../middleware/Auth";
import { superAuth } from "../middleware/SuperAuth";
import { Cookbook, SerializedCookbook } from "../models/Cookbook";
import CookbookService from "../services/CookbookService";
import { BaseController } from "./BaseController";
import { GuideController } from "./GuideController";
import { PostController } from "./PostController";
import { SectionController } from "./SectionController";
import { TagController } from "./TagController";

export class CookbookController extends BaseController<
  Cookbook,
  SerializedCookbook
> {
  constructor(cookBookService: CookbookService) {
    super(Cookbook, cookBookService, ROUTES.COOKBOOKS);
  }

  setChildRoutes() {
    const guideController = AppInjector.injectClass(GuideController);
    const sectionController = AppInjector.injectClass(SectionController);
    const tagController = AppInjector.injectClass(TagController);
    const postController = AppInjector.injectClass(PostController);

    this.router.use(this.buildRoute(ROUTES.GUIDES), guideController.router);
    this.router.use(this.buildRoute(ROUTES.SECTIONS), sectionController.router);
    this.router.use(this.buildRoute(ROUTES.TAGS), tagController.router);
    this.router.use(this.buildRoute(ROUTES.POSTS), postController.router);
  }

  private buildRoute(route) {
    return `${this.detailRoute()}/${route}`;
  }

  @superAuth()
  async create(req, res) {
    super.create(req, res);
  }

  @superAuth()
  async deleteOne(req, res) {
    super.deleteOne(req, res);
  }

  @cookbookAuth()
  async update(req, res) {
    super.update(req, res);
  }

  public static inject = ["cookbookService"] as const;
}
