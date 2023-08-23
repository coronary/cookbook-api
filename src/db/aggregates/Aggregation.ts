import { Collection, Document } from "mongodb";
import autoBind from "../../utils/autobind";

export default class Aggregation {
  private pipeline: Document[];
  private collection: Collection;

  constructor(pipeline: Document[], collection: Collection) {
    this.pipeline = pipeline;
    this.collection = collection;
    autoBind(this);
  }

  public async aggregateSingle() {
    return await this.collection.aggregate(this.pipeline);
  }

  public async aggregateMany() {
    return await this.collection.aggregate(this.pipeline).toArray();
  }
}
