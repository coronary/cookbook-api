import { Collection } from "mongodb";
import {
  AggregationBuilder,
  FilterField,
  Population,
} from "./AggregationBuilder";

export class AggregationDirector {
  private builder: AggregationBuilder;
  private steps: {
    find?: (...args) => AggregationBuilder;
    search?: (...args) => AggregationBuilder;
    populate?: (...args) => AggregationBuilder;
    limit?: (...args) => AggregationBuilder;
    skip?: (...args) => AggregationBuilder;
    sort?: (...args) => AggregationBuilder;
  };

  constructor(collection: Collection) {
    this.builder = new AggregationBuilder(collection);
    this.steps = {};
  }

  public build() {
    const hasSearch = this.steps.search != null;
    const hasSkip = this.steps.skip != null;
    const hasLimit = this.steps.limit != null;

    this.steps?.find?.();
    this.steps?.sort?.();

    if (hasSkip && !hasSearch) {
      this.steps.skip?.();
    }

    if (hasLimit && !hasSearch) {
      this.steps.limit?.();
    }

    this.steps.populate?.();

    if (hasSearch) {
      this.steps.sort?.();
      this.steps.search?.();
      this.steps.skip?.();
      this.steps.limit?.();
    }

    return this.builder.build();
  }

  public find(params) {
    this.steps.find = () => this.builder.find.apply(this, [params]);
    return this;
  }

  public search(search, searchFields: string[], filterFields?: FilterField[]) {
    this.steps.search = () =>
      this.builder.search.apply(this, [search, searchFields, filterFields]);
    return this;
  }

  public populate(populations: Population[]) {
    this.steps.populate = () =>
      this.builder.populate.apply(this, [populations]);
    return this;
  }

  public limit(limit: number | string | null | undefined) {
    this.steps.limit = () => this.builder.limit.apply(this, [limit]);
    return this;
  }

  public skip(skip: number | string | null | undefined) {
    this.steps.skip = () => this.builder.skip.apply(this, [skip]);
    return this;
  }

  public sort(sort: number) {
    this.steps.sort = () => this.builder.sort.apply(this, [sort]);
    return this;
  }
}
