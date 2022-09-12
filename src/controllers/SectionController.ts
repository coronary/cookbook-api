import { ROUTES } from "../constants/Constants";
import { cookbookAuth } from "../middleware/Auth";
import { Section, SerializedSection } from "../models/Section";
import SectionService from "../services/SectionService";
import { BaseController } from "./BaseController";

export class SectionController extends BaseController<
  Section,
  SerializedSection
> {
  constructor(sectionService: SectionService) {
    super(Section, sectionService, ROUTES.SECTIONS);
  }

  @cookbookAuth()
  async create(req, res) {
    super.create(req, res);
  }

  @cookbookAuth()
  async deleteOne(req, res) {
    super.deleteOne(req, res);
  }

  @cookbookAuth()
  async update(req, res) {
    super.update(req, res);
  }

  public static inject = ["sectionService"] as const;
}
