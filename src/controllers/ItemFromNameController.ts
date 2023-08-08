import { Router } from "express";
import { logRoutes } from "../utils/Logging";
import { ROUTES } from "../constants/Constants";
import createError from "http-errors";
import { AppInjector } from "../app";
import GuideService from "../services/GuideService";
import CookbookService from "../services/CookbookService";
import { ObjectId } from "mongodb";
import SectionService from "../services/SectionService";

export class ItemFromNameController {
  public router = Router();
  public route = ROUTES.COOKBOOK_NAME;

  constructor() {
    this.setRoutes = this.setRoutes.bind(this);
    this.setRoutes();
    logRoutes(`/${this.route}`, this.router);
  }

  setRoutes() {
    this.router.get(`/:${ROUTES.COOKBOOK_NAME}`, this.getCookbook);
    this.router.get(
      `/:${ROUTES.COOKBOOK_NAME}/${ROUTES.GUIDE_NAME}/:${ROUTES.GUIDE_NAME}`,
      this.getGuide
    );
    this.router.get(
      `/:${ROUTES.COOKBOOK_NAME}/${ROUTES.GUIDE_NAME}/:${ROUTES.GUIDE_NAME}/${ROUTES.SECTION_NAME}/:${ROUTES.SECTION_NAME}`,
      this.getSection
    );
  }

  getCookbook = async (req, res, next) => {
    const { cookbookName } = req.params;
    const { filters } = req.query ?? { filters: {} };

    if (cookbookName == null) {
      return next(createError(404, "Invalid query params"));
    }

    const cookbook = await this.getCookbookFromName(cookbookName, filters);

    if (cookbook == null) {
      return next(createError(404, "Cookbook Not Found"));
    }

    res.send(await cookbook.sanitizeAsync());
  };

  getGuide = async (req, res, next) => {
    const { cookbookName, guideName } = req.params;

    if (cookbookName == null || guideName == null) {
      return next(createError(404, "Invalid query params"));
    }

    const cookbook = await this.getCookbookFromName(cookbookName);

    if (cookbook == null) {
      return next(createError(404, "Cookbook Not Found"));
    }

    const guide = await this.getGuideFromName(guideName, cookbook.id);

    if (guide == null) {
      return next(createError(404, "Guide Not Found"));
    }

    res.send(await guide.sanitizeAsync());
  };

  getSection = async (req, res, next) => {
    const { cookbookName, guideName, sectionName } = req.params;

    if (cookbookName == null || guideName == null || sectionName == null) {
      return next(createError(404, "Invalid query params"));
    }

    const cookbook = await this.getCookbookFromName(cookbookName);

    if (cookbook == null) {
      return next(createError(404, "Cookbook Not Found"));
    }

    const guide = await this.getGuideFromName(guideName, cookbook.id);

    if (guide == null) {
      return next(createError(404, "Guide Not Found"));
    }

    const section = await this.getSectionFromName(
      sectionName,
      cookbook.id,
      guide.id
    );

    if (section == null) {
      return next(createError(404, "Section Not Found"));
    }

    res.send(section.sanitize());
  };

  async getCookbookFromName(name: string, filters = {}) {
    const cookbooks =
      (await AppInjector.injectClass(CookbookService).get({
        name,
        ...filters,
      })) ?? [];
    return cookbooks[0];
  }

  async getGuideFromName(name: string, cookbook: ObjectId) {
    const guides =
      (await AppInjector.injectClass(GuideService).get({
        cookbook,
        name: name,
      })) ?? [];
    return guides[0];
  }

  async getSectionFromName(name: string, cookbook: ObjectId, guide: ObjectId) {
    const sections =
      (await AppInjector.injectClass(SectionService).get({
        cookbook,
        guide,
        name: name,
      })) ?? [];
    return sections[0];
  }
}
