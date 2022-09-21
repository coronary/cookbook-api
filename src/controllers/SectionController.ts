import { ROUTES } from "../constants/Constants";
import { Section, SerializedSection } from "../models/Section";
import SectionService from "../services/SectionService";
import { CookbookBaseController } from "./CookbookBaseController";

export class SectionController extends CookbookBaseController<
  Section,
  SerializedSection
> {
  constructor(sectionService: SectionService) {
    super(Section, sectionService, ROUTES.SECTIONS);
  }

  public static inject = ["sectionService"] as const;
}
