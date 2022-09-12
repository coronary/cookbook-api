import { Collection } from "mongodb";
import { GenericModel } from "../controllers/BaseController";
import { get, save, getById, deleteOne } from "../db/db";
import { BaseModel } from "../models/BaseModel";
import autoBind from "../utils/autobind";

export interface Service<M> {
  getById: (id: string) => Promise<M>;
  get: (any?) => Promise<Array<M>>;
  save: (any) => Promise<M>;
  deleteOne: (id: string) => Promise<void>;
}

export class BaseService<T extends BaseModel<T, M>, M> implements Service<M> {
  constructor(public collection: Collection, public type: GenericModel<T, M>) {
    autoBind(this);
  }

  public async getById(id: string): Promise<M> {
    const document = await getById(this.collection, id);
    if (document == null) {
      throw new Error("Document Not Found");
    }
    return new this.type({ ...this.serialize(document) }).serialize();
  }

  public async get(filter?): Promise<Array<M>> {
    const documents = await get(this.collection, filter);

    if (documents == null) {
      throw new Error("Documents Not Found");
    }
    const serializedDocuments = documents.map((u) => {
      return new this.type({ ...this.serialize(u) }).serialize();
    });

    return serializedDocuments;
  }

  public async save(params): Promise<M> {
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
