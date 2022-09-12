import { ROUTES } from "../constants/Constants";
import { auth } from "../middleware/Auth";
import { Section } from "../models/Section";
import SectionService from "../services/SectionService";
import { BaseController } from "./BaseController";

export class SectionController extends BaseController<Section> {
  constructor() {
    super(Section, new SectionService(), ROUTES.SECTIONS);
  }

  @auth()
  async create(req, res) {
    super.create(req, res);
  }

  @auth()
  async deleteOne(req, res) {
    super.deleteOne(req, res);
  }

  @auth()
  async update(req, res) {
    super.update(req, res);
  }
}
