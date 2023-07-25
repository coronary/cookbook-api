import CookbookService from "../services/CookbookService";
import createError from "http-errors";
import { AppInjector } from "../app";

export const cookbookAuth = (): any => {
  return (target: any, propertyKey: string, descriptor: any) => {
    const fn = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const [req, res, next] = args;
      const cookbookId = req.params.cookbooks;
      const user = req.user;

      if (cookbookId == null || user == null) {
        return next(createError(401, "Unauthorized"));
      }

      if (user.super_user === true) {
        return fn.apply(this, args);
      }

      const cookbookService = AppInjector.injectClass(CookbookService);

      try {
        const cookbook = await cookbookService.getById(cookbookId);

        if (cookbook != null && cookbook.authUser(user.id)) {
          return fn.apply(this, args);
        }

        return next(createError(401, "Unauthorized"));
      } catch (err) {
        return next(createError(500, err));
      }
    };
  };
};
