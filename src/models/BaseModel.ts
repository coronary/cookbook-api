import { Service } from "../services/BaseService";
import autoBind from "../utils/autobind";

export class BaseModel<T, M> {
  constructor(public service: Service<M>) {
    autoBind(this);
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
