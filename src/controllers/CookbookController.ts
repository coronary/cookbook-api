import { AppInjector } from "../app";
import { ROUTES } from "../constants/Constants";
import { cookbookAuth } from "../middleware/Auth";
import { superAuth } from "../middleware/SuperAuth";
import { Cookbook } from "../models/Cookbook";
import CookbookService from "../services/CookbookService";
import { BaseController } from "./BaseController";
import { FileController } from "./FileController";
import { GuideController } from "./GuideController";
import { PostController } from "./PostController";
import { SectionController } from "./SectionController";
import { TagController } from "./TagController";

export class CookbookController extends BaseController<Cookbook> {
  constructor(cookBookService: CookbookService) {
    super(Cookbook, cookBookService, ROUTES.COOKBOOKS);
  }

  setChildRoutes() {
    const guideController = AppInjector.injectClass(GuideController);
    const sectionController = AppInjector.injectClass(SectionController);
    const tagController = AppInjector.injectClass(TagController);
    const postController = AppInjector.injectClass(PostController);
    const fileController = AppInjector.injectClass(FileController);

    this.router.use(this.buildRoute(ROUTES.GUIDES), guideController.router);
    this.router.use(this.buildRoute(ROUTES.SECTIONS), sectionController.router);
    this.router.use(this.buildRoute(ROUTES.TAGS), tagController.router);
    this.router.use(this.buildRoute(ROUTES.POSTS), postController.router);
    this.router.use(this.buildRoute(ROUTES.FILES), fileController.router);
  }

  private buildRoute(route) {
    return `${this.detailRoute()}/${route}`;
  }

  @superAuth()
  async create(req, res, next) {
    super.create(req, res, next);
  }

  @superAuth()
  async deleteOne(req, res, next) {
    super.deleteOne(req, res, next);
  }

  @cookbookAuth()
  async update(req, res, next) {
    super.update(req, res, next);
  }

  public static inject = ["cookbookService"] as const;
}
