import { ROUTES } from "../constants/Constants";
import { cookbookAuth } from "../middleware/Auth";
import { guideId } from "../middleware/GuideId";
import { BaseModel } from "../models/BaseModel";
import { Service } from "../services/BaseService";
import { BaseController, GenericModel } from "./BaseController";

export class GuideBaseController<
  T extends BaseModel
> extends BaseController<T> {
  constructor(
    public model: GenericModel<T>,
    public service: Service<T>,
    route: string
  ) {
    super(
      model,
      service,
      route,
      `/${ROUTES.COOKBOOKS}/:${ROUTES.COOKBOOKS}/${ROUTES.GUIDES}/:${ROUTES.GUIDES}`
    );
  }

  @guideId()
  async getAll(req, res, next) {
    super.getAll(req, res, next);
  }

  @guideId()
  @cookbookAuth()
  async create(req, res, next) {
    super.create(req, res, next);
  }

  @cookbookAuth()
  async deleteOne(req, res, next) {
    super.deleteOne(req, res, next);
  }

  @cookbookAuth()
  async update(req, res, next) {
    super.update(req, res, next);
  }
}
