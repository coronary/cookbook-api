import { Router } from "express";
import { Catch } from "../middleware/ErrorHandler";
import { BaseModel } from "../models/BaseModel";
import { Service } from "../services/BaseService";
import { logRoutes } from "../utils/Logging";

export interface Controller {
  router: Router;
  create: (req, res) => void;
  update: (req, res) => void;
  delete: (req, res) => void;
  getById: (req, res) => void;
  getAll: (req, res) => void;
  deleteOne: (req, res) => void;
}

export interface GenericModel<T extends BaseModel<T>> {
  new (any): T;
}

export class BaseController<T extends BaseModel<T>> {
  public router = Router();

  constructor(
    public model: GenericModel<T>,
    public service: Service<T>,
    public route: string
  ) {
    this.setRoutes = this.setRoutes.bind(this);
    this.getById = this.getById.bind(this);
    this.getAll = this.getAll.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.setRoutes();
    logRoutes(`/${this.route}`, this.router);
  }

  setRoutes() {
    this.router.get("/", this.getAll);
    this.router.post("/", this.create);
    this.router.get(this.detailRoute(), this.getById);
    this.router.put(this.detailRoute(), this.update);
    this.router.delete(this.detailRoute(), this.deleteOne);
  }

  @Catch()
  async getAll(req, res) {
    const model = await this.service.get();
    res.send(model);
  }

  detailRoute(): string {
    return `/:${this.route}`;
  }

  @Catch()
  async create(req, res) {
    const { body } = req;
    const model = new this.model({
      ...body,
    });
    res.send(await model.save());
  }

  @Catch()
  async update(req, res) {
    const { body, params } = req;
    const id = params[this.route];
    const model = await this.service.getById(id);
    const newModel = new this.model({ ...model, ...body });
    res.send(await newModel.save());
  }

  @Catch()
  async deleteOne(req, res) {
    const id = req.params[this.route];
    await this.service.deleteOne(id);
    res.send();
  }

  @Catch()
  async getById(req, res) {
    const id = req.params[this.route];
    const model = await this.service.getById(id);
    res.send(model);
  }
}
