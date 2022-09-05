import { Router } from "express";
import { ModelType } from "../models/Model.types";
import { Controller } from "./Controller.types";

export class BaseController<T extends ModelType> implements Controller {
  public router = Router();
  constructor(
    private type: {
      new (any): T;
      getOne(string): Promise<T>;
      getAll(): Promise<Array<T>>;
    },
    private route: string
  ) {
    this.get = this.get.bind(this);
    this.getAll = this.getAll.bind(this);
    this.setRoutes();
  }

  setRoutes() {
    this.router.get(`/:${this.route}`, this.get);
    this.router.get("/", this.getAll);
    this.router.post("/", this.create);
    this.router.put(`/:${this.route}`, this.update);
    this.router.delete(`/:${this.route}`, this.delete);
  }

  async create(req, res) {
    const model = new this.type({
      ...req.body,
    });
    await model.save();
    res.send(model);
  }

  async update(req, res) {
    const { id } = req.query;
    if (id) {
      const model = await this.type.getOne(id);
      const newModelk = new this.type({ ...model, ...req.body });
      await newModelk.save();
      res.send(newModelk);
    }
  }

  delete(req, res) {
    res.send("Ok");
  }

  async get(req, res) {
    const { id } = req.query;
    if (id) {
      const model = await this.type.getOne(id);
      res.send(model);
    }
  }

  async getAll(req, res) {
    const model = await this.type.getAll();
    res.send(model);
  }
}
