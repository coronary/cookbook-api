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

export interface GenericModel<T extends BaseModel<T, M>, M> {
  new (any): T;
}

export class BaseController<T extends BaseModel<T, M>, M> {
  public router = Router({ mergeParams: true });

  constructor(
    public model: GenericModel<T, M>,
    public service: Service<M>,
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
  async getAll(req, res) {
    const model = await this.service.get({ ...req.body });
    res.send(model);
  }

  detailRoute(): string {
    return `/:${this.route}`;
  }

  @tryCatch()
  async create(req, res) {
    const { body } = req;
    const model = new this.model({
      ...body,
    });
    res.send(await model.save());
  }

  @tryCatch()
  async update(req, res) {
    const { body, params } = req;
    const id = params[this.route];
    const model = await this.service.getById(id);
    const newModel = new this.model({ ...model, ...body });
    res.send(await newModel.save());
  }

  @tryCatch()
  async deleteOne(req, res) {
    const id = req.params[this.route];
    await this.service.deleteOne(id);
    res.send();
  }

  @tryCatch()
  async getById(req, res) {
    const id = req.params[this.route];
    const model = await this.service.getById(id);
    res.send(model);
  }
}
