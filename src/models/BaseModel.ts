import { Service } from "../services/BaseService";

export class BaseModel<T, M> {
  constructor(public service: Service<M>) {
    this.save = this.save.bind(this);
    this.serialize = this.serialize.bind(this);
  }

  async save(): Promise<M> {
    const saved = await this.service.save(this.serialize());

    return saved;
  }

  deserialize(): any {
    throw new Error("Overload BaseModel.deserialize");
  }

  serialize(): any {
    throw new Error("Overload BaseModel.serialize");
  }
}
