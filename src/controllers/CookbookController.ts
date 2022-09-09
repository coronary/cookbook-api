import { ROUTES } from "../constants/Constants";
import { auth } from "../middleware/Auth";
import { superAuth } from "../middleware/SuperAuth";
import { Cookbook } from "../models/Cookbook";
import CookbookService from "../services/CookbookService";
import { BaseController } from "./BaseController";

export class CookbookController extends BaseController<Cookbook> {
  constructor() {
    super(Cookbook, new CookbookService(), ROUTES.COOKBOOKS);
  }

  @superAuth()
  async create(req, res) {
    super.create(req, res);
  }

  @superAuth()
  async deleteOne(req, res) {
    super.deleteOne(req, res);
  }

  @auth()
  async update(req, res) {
    super.update(req, res);
  }
}
