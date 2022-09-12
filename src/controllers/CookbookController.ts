import { ROUTES } from "../constants/Constants";
import { cookbookAuth } from "../middleware/Auth";
import { superAuth } from "../middleware/SuperAuth";
import { Cookbook, SerializedCookbook } from "../models/Cookbook";
import CookbookService from "../services/CookbookService";
import { BaseController } from "./BaseController";

export class CookbookController extends BaseController<
  Cookbook,
  SerializedCookbook
> {
  constructor(cookBookService: CookbookService) {
    super(Cookbook, cookBookService, ROUTES.COOKBOOKS);
  }

  @superAuth()
  async create(req, res) {
    super.create(req, res);
  }

  @superAuth()
  async deleteOne(req, res) {
    super.deleteOne(req, res);
  }

  @cookbookAuth()
  async update(req, res) {
    super.update(req, res);
  }

  public static inject = ["cookbookService"] as const;
}
