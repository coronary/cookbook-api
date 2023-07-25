import autoBind from "../utils/autobind";

export class BaseModel {
  constructor() {
    autoBind(this);
  }

  sanitize(): any {
    throw new Error("Overload BaseModel.sanitize");
  }

  async sanitizeAsync(): Promise<any> {
    throw new Error("Overload BaseModel.sanitizeAsync");
  }
}
