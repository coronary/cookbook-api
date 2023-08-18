import { Collection } from "mongodb";
import { GenericModel } from "../controllers/BaseController";
import { get, save, getById, deleteOne } from "../db/db";
import { BaseModel } from "../models/BaseModel";
import autoBind from "../utils/autobind";

export interface Service<T> {
  getById: (id: string) => Promise<T>;
  get: (filter?, options?) => Promise<Array<T>>;
  save: (any) => Promise<T>;
  deleteOne: (id: string) => Promise<void>;
}

export class BaseService<T extends BaseModel> implements Service<T> {
  constructor(public collection: Collection, public type: GenericModel<T>) {
    autoBind(this);
  }

  public async getById(id: string): Promise<T> {
    const document = await getById(this.collection, id);
    if (document == null) {
      throw new Error("Document Not Found");
    }
    return new this.type({ ...this.serialize(document) });
  }

  public async get(filter?, options?): Promise<Array<T>> {
    const documents = await get(this.collection, filter, options);

    if (documents == null) {
      throw new Error("Documents Not Found");
    }

    return documents.map((d) => new this.type({ ...this.serialize(d) }));
  }

  public async save(model): Promise<T> {
    const deserializedModel = this.deserialize(model);
    const document = await save(this.collection, deserializedModel);
    return new this.type({ ...this.serialize(document) });
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
