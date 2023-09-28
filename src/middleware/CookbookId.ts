import createError from "http-errors";
import { ObjectId } from "mongodb";
import { DecoratorFactory } from "./DecoratorFactory";

export const cookbookId = (): any => {
  return DecoratorFactory.createDecorator((req, res, next) => {
    try {
      const cookbookId = req.params.cookbooks;

      if (cookbookId == null) {
        return next(createError(404, "Cookbook not found"));
      }

      req.query.filters.cookbook = new ObjectId(cookbookId);
      req.body.cookbook = new ObjectId(cookbookId);
    } catch (err) {
      console.log("🚀 ~ file: CookbookId.ts:19 ~ err:", err);
    }
  });
};
