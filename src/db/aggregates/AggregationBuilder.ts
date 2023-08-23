import { Collection, Document } from "mongodb";
import autoBind from "../../utils/autobind";
import Aggregation from "./Aggregation";

export interface Population {
  field: string;
  fromCollection: string;
  unwind?: boolean;
}

export interface FilterField {
  name: string;
  values: string[];
}

export class AggregationBuilder {
  private pipeline: Document[];
  private collection: Collection;

  constructor(collection: Collection) {
    this.collection = collection;
    this.pipeline = [];
    autoBind(this);
  }

  public build() {
    return new Aggregation(this.pipeline, this.collection);
  }

  public find(params: any) {
    this.pipeline.push({
      $match: params,
    });
    return this;
  }

  public search(search, searchFields: string[], filterFields?: FilterField[]) {
    const match: Document = {};

    if (
      search != null &&
      search.length > 0 &&
      searchFields != null &&
      searchFields.length > 0
    ) {
      match.$or = searchFields.map((field) => {
        return {
          [field]: { $regex: search, $options: "i" },
        };
      });
    }

    if (filterFields != null && filterFields.length > 0) {
      for (const filterField of filterFields) {
        match[filterField.name] = { $all: filterField.values };
      }
    }

    if (Object.keys(match).length === 0) return this;

    return this.find(match);
  }

  public populate(populations: Population[]) {
    if (populations == null || populations.length === 0) return this;

    const _populations: Document[] = [];
    for (const population of populations) {
      const { field, fromCollection, unwind } = population;

      _populations.push({
        $lookup: {
          from: fromCollection,
          localField: field,
          foreignField: "_id",
          as: field,
        },
      });

      if (unwind) {
        _populations.push({ $unwind: { path: `$${field}` } });
      }
    }
    this.pipeline = this.pipeline.concat(_populations);
    return this;
  }

  public limit(limit: number | string | null | undefined) {
    if (limit == null) return this;

    if (typeof limit === "string") {
      limit = parseInt(limit);
    }

    this.pipeline.push({ $limit: limit });
    return this;
  }

  public skip(skip: number | string | null | undefined) {
    if (skip == null) return this;

    if (typeof skip === "string") {
      skip = parseInt(skip);
    }

    this.pipeline.push({ $skip: skip });
    return this;
  }

  public sort(sort: number) {
    this.pipeline.push({ $sort: { _id: sort ?? -1 } });
    return this;
  }
}
