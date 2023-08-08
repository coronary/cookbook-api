import createError from "http-errors";
import { ObjectId } from "mongodb";

export const cookbookId = (): any => {
  return (target: any, propertyKey: string, descriptor: any) => {
    const fn = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      try {
        const [req, res, next] = args;
        const cookbookId = req.params.cookbooks;

        if (cookbookId == null) {
          return next(createError(404, "Cookbook not found"));
        }

        req.body.cookbook = new ObjectId(cookbookId);
        return fn.apply(this, args);
      } catch (err) {
        console.log("🚀 ~ file: CookbookId.ts:19 ~ err:", err);
      }
    };
  };
};
