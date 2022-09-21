import { ROUTES } from "../constants/Constants";
import { cookbookAuth } from "../middleware/Auth";
import { cookbookId } from "../middleware/CookbookId";
import { BaseModel } from "../models/BaseModel";
import { Service } from "../services/BaseService";
import { BaseController, GenericModel } from "./BaseController";

export class CookbookBaseController<
  T extends BaseModel<T, M>,
  M
> extends BaseController<T, M> {
  constructor(
    public model: GenericModel<T, M>,
    public service: Service<M>,
    route: string
  ) {
    super(model, service, route, `/${ROUTES.COOKBOOKS}/:${ROUTES.COOKBOOKS}`);
  }

  @cookbookId()
  async getAll(req, res) {
    super.getAll(req, res);
  }

  @cookbookId()
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
}
