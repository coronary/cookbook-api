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

export class SectionController extends GuideBaseController<Section> {
  constructor(
    private sectionService: SectionService,
    private guideService: GuideService
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

  public static inject = ["sectionService", "guideService"] as const;
}
