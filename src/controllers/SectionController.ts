import { ObjectId } from "mongodb";
import { ROUTES } from "../constants/Constants";
import { cookbookId } from "../middleware/CookbookId";
import { tryCatch } from "../middleware/ErrorHandler";
import { guideId } from "../middleware/GuideId";
import { Guide } from "../models/Guide";
import { Section } from "../models/Section";
import GuideService from "../services/GuideService";
import SectionService from "../services/SectionService";
import { GuideBaseController } from "./GuideBaseController";
import RedisCache, { Caches } from "../db/RedisCache";
import CookbookService from "../services/CookbookService";

export class SectionController extends GuideBaseController<Section> {
  constructor(
    private sectionService: SectionService,
    private guideService: GuideService,
    private cookbookService: CookbookService
  ) {
    super(Section, sectionService, ROUTES.SECTIONS);
  }

  @tryCatch()
  @cookbookId()
  @guideId()
  async create(req, res, next) {
    const { body } = req;
    const { name, cookbook: cookbookId, guide: guideId } = body;

    if (name == null) {
      throw new Error("must provide name");
    }

    const sectionModel = new Section({
      name,
      body: "",
      guide: guideId,
      cookbook: cookbookId,
    });
    const section = await this.sectionService.save(sectionModel);
    const guide = await this.guideService.getById(guideId);
    const guideModel = new Guide({
      ...guide,
      sections: [...(guide.sections as ObjectId[]), section.id],
    });
    await this.guideService.save(guideModel);
    res.send(section.sanitize());
  }

  @tryCatch()
  @guideId()
  @cookbookId()
  async deleteOne(req, res, next) {
    const { body, params } = req;
    const { cookbook: cookbookId, guide: guideId } = body;
    const { sections: sectionId } = params;

    await this.sectionService.deleteOne(sectionId);

    const guide = await this.guideService.getById(guideId);
    const guideModel = new Guide({
      ...guide,
      sections: (guide.sections as ObjectId[]).filter(
        (s: ObjectId) => s.toString() !== sectionId.toString()
      ),
    });

    await this.guideService.save(guideModel);

    const cookbook = await this.cookbookService.getById(cookbookId);

    await RedisCache.delete(Caches.COOKBOOK(cookbook.name));

    res.status(200).send();
  }

  public static inject = [
    "sectionService",
    "guideService",
    "cookbookService",
  ] as const;
}
