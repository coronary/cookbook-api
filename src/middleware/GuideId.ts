import createError from "http-errors";
import { ObjectId } from "mongodb";
import { DecoratorFactory } from "./DecoratorFactory";

export const guideId = (): any => {
  return DecoratorFactory.createDecorator((req, res, next) => {
    const guideId = req.params.guides;

    if (guideId == null) {
      return next(createError(404, "Guide not found"));
    }
    req.query.filters.guide = new ObjectId(guideId);
    req.body.guide = new ObjectId(guideId);
  });
};
