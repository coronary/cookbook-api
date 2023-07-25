import { ROUTES } from "../constants/Constants";
import { Section } from "../models/Section";
import SectionService from "../services/SectionService";
import { CookbookBaseController } from "./CookbookBaseController";

export class SectionController extends CookbookBaseController<Section> {
  constructor(sectionService: SectionService) {
    super(Section, sectionService, ROUTES.SECTIONS);
  }

  public static inject = ["sectionService"] as const;
}
