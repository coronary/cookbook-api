export abstract class ModelType {
  save: () => Promise<void>;
  static getOne: () => Promise<any>;
  static getAll: () => Promise<Array<any>>;
}
