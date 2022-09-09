import { Collection } from "mongodb";
import { GenericModel } from "../controllers/BaseController";
import { get, save, getById, deleteOne } from "../db/db";
import { BaseModel } from "../models/BaseModel";

export interface Service<T> {
  getById: (id: string) => Promise<T>;
  get: (any?) => Promise<Array<T>>;
  save: (any) => Promise<T>;
  deleteOne: (id: string) => Promise<void>;
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
    if (document == null) {
      throw new Error("Document Not Found");
    }
    return new this.type({ ...this.serialize(document) }).serialize();
  }

  public async get(filter?): Promise<Array<T>> {
    const documents = await get(this.collection, filter);
    if (documents == null) {
      throw new Error("Documents Not Found");
    }
    return documents.map((u) =>
      new this.type({ ...this.serialize(u) }).serialize()
    );
  }

  public async save(params): Promise<T> {
    const { id, ...body } = params;
    const document = await save(this.collection, id, this.deserialize(body));
    return new this.type({ ...this.serialize(document) }).serialize();
  }

  public async deleteOne(id): Promise<void> {
    return deleteOne(this.collection, id);
  }

  public serialize(document): any {
    throw new Error("Overload BaseService.serialize");
  }

  public deserialize(model): any {
    throw new Error("Overload BaseService.deserialize");
  }
}
