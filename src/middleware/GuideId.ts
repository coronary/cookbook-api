import createError from "http-errors";
import { ObjectId } from "mongodb";

export const guideId = (): any => {
  return (target: any, propertyKey: string, descriptor: any) => {
    const fn = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const [req, res, next] = args;
      const guideId = req.params.guides;

      if (guideId == null) {
        return next(createError(404, "Guide not found"));
      }
      req.query.filters.guide = new ObjectId(guideId);
      req.body.guide = new ObjectId(guideId);
      return fn.apply(this, args);
    };
  };
};
