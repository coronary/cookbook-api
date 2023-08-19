import { Router } from "express";
import { tryCatch } from "../middleware/ErrorHandler";
import { BaseModel } from "../models/BaseModel";
import { Service } from "../services/BaseService";
import { logRoutes } from "../utils/Logging";
import autoBind from "../utils/autobind";

export interface Controller {
  router: Router;
  create: (req, res) => void;
  update: (req, res) => void;
  delete: (req, res) => void;
  getById: (req, res) => void;
  getAll: (req, res) => void;
  deleteOne: (req, res) => void;
}

export interface GenericModel<T extends BaseModel> {
  new (any): T;
}

export class BaseController<T extends BaseModel> {
  public router = Router({ mergeParams: true });

  constructor(
    public model: GenericModel<T>,
    public service: Service<T>,
    public route: string,
    public parentRoute: string = ""
  ) {
    autoBind(this);
    this.setRoutes();
    this.setChildRoutes();
    logRoutes(`${this.parentRoute}/${this.route}`, this.router);
  }

  setRoutes() {
    this.router.get("/", this.getAll);
    this.router.post("/", this.create);
    this.router.get(this.detailRoute(), this.getById);
    this.router.put(this.detailRoute(), this.update);
    this.router.delete(this.detailRoute(), this.deleteOne);
  }

  setChildRoutes() {}

  @tryCatch()
  async getAll(req, res, next) {
    const { populate, filters, options, search } = req.query;
    const models = await this.service.get(filters, options, search);
    const sanitizedModels = [];
    for (const model of models) {
      sanitizedModels.push(
        populate === "true" ? await model.sanitizeAsync() : model.sanitize()
      );
    }
    res.send(sanitizedModels);
  }

  detailRoute(): string {
    return `/:${this.route}`;
  }

  @tryCatch()
  async create(req, res, next) {
    const { body } = req;
    const model = await this.service.save({ ...body });
    res.send(model.sanitize());
  }

  @tryCatch()
  async update(req, res, next) {
    const { body, params } = req;
    const id = params[this.route];
    const model = await this.service.save({ id, ...body });
    res.send(model.sanitize());
  }

  @tryCatch()
  async deleteOne(req, res, next) {
    const id = req.params[this.route];
    await this.service.deleteOne(id);
    res.send();
  }

  @tryCatch()
  async getById(req, res, next) {
    const id = req.params[this.route];
    const { populate } = req.query;
    const model = await this.service.getById(id);
    res.send(
      populate === "true" ? await model.sanitizeAsync() : model.sanitize()
    );
  }
}
