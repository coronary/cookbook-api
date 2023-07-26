import { ROUTES } from "../constants/Constants";
import { Section } from "../models/Section";
import SectionService from "../services/SectionService";
import { GuideBaseController } from "./GuideBaseController";

export class SectionController extends GuideBaseController<Section> {
  constructor(sectionService: SectionService) {
    super(Section, sectionService, ROUTES.SECTIONS);
  }

  public static inject = ["sectionService"] as const;
}
