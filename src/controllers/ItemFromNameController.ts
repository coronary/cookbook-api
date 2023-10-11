import { Router } from "express";
import { logRoutes } from "../utils/Logging";
import { ROUTES } from "../constants/Constants";
import createError from "http-errors";
import CookbookService from "../services/CookbookService";
import SectionService from "../services/SectionService";
import RedisCache, { Caches } from "../db/RedisCache";
import { tryCatch } from "../middleware/ErrorHandler";
import autoBind from "../utils/autobind";

export class ItemFromNameController {
  public router = Router();
  public route = ROUTES.COOKBOOK_NAME;

  constructor(
    private cookbookService: CookbookService,
    private sectionService: SectionService,
  ) {
    autoBind(this);
    this.setRoutes();
    logRoutes(`/${this.route}`, this.router);
  }

  setRoutes() {
    this.router.get(`/:${ROUTES.COOKBOOK_NAME}`, this.getCookbook);
    this.router.get(
      `/:${ROUTES.COOKBOOK_NAME}/${ROUTES.GUIDE_NAME}/:${ROUTES.GUIDE_NAME}/${ROUTES.SECTION_NAME}/:${ROUTES.SECTION_NAME}`,
      this.getSection,
    );
  }

  @tryCatch()
  async getCookbook(req, res, next) {
    const { cookbookName } = req.params;

    if (cookbookName == null) {
      return next(createError(404, "Invalid query params"));
    }

    const cachedCookbook = await RedisCache.get(Caches.COOKBOOK(cookbookName));

    if (cachedCookbook != null) {
      res.send(cachedCookbook);
      return;
    }

    const cookbook = await this.cookbookService.getPopulatedCookbook(
      cookbookName,
    );

    if (cookbook == null) {
      return next(createError(404, "Cookbook Not Found"));
    }

    await RedisCache.set(Caches.COOKBOOK(cookbookName), cookbook);

    res.send(cookbook.sanitize());
  }

  @tryCatch()
  async getSection(req, res, next) {
    const { cookbookName, guideName, sectionName } = req.params;

    if (cookbookName == null || guideName == null || sectionName == null) {
      return next(createError(404, "Invalid query params"));
    }

    const cachedSection = await RedisCache.get(
      Caches.SECTION(cookbookName, guideName, sectionName),
    );

    if (cachedSection != null) {
      res.send(cachedSection);
      return;
    }

    const section = await this.sectionService.getSectionFromNames(
      cookbookName,
      guideName,
      sectionName,
    );

    if (section == null) {
      return next(createError(404, "Section Not Found"));
    }

    await RedisCache.set(
      Caches.SECTION(cookbookName, guideName, sectionName),
      section,
    );

    res.send(section.sanitize());
  }

  public static inject = ["cookbookService", "sectionService"] as const;
}
