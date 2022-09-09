import { Collection } from "mongodb";
import { GenericModel } from "../controllers/BaseController";
import { get, save, getById } from "../db/db";
import { BaseModel } from "../models/BaseModel";

export interface Service<T> {
  getById: (id: string) => Promise<T>;
  get: (any?) => Promise<Array<T>>;
  save: (any) => Promise<T>;
}

export class BaseService<T extends BaseModel<T>> implements Service<T> {
  constructor(public collection: Collection, public type: GenericModel<T>) {
    this.getById = this.getById.bind(this);
    this.get = this.get.bind(this);
    this.save = this.save.bind(this);
    this.serialize = this.serialize.bind(this);
    this.deserialize = this.deserialize.bind(this);
  }

  public async getById(id: string): Promise<T> {
    const document = await getById(this.collection, id);
    return new this.type({ ...this.serialize(document) }).serialize();
  }

  public async get(filter?): Promise<Array<T>> {
    const documents = await get(this.collection, filter);
    return documents.map((u) =>
      new this.type({ ...this.serialize(u) }).serialize()
    );
  }

  public async save(params): Promise<T> {
    const { id, ...body } = params;
    const document = await save(this.collection, id, this.deserialize(body));
    return new this.type({ ...this.serialize(document) }).serialize();
  }

  // OVERLOAD
  public serialize(document) {
    return document;
  }

  // OVERLOAD
  public deserialize(model) {
    return model;
  }
}
