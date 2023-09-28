import CookbookService from "../services/CookbookService";
import createError from "http-errors";
import { DecoratorFactory } from "./DecoratorFactory";

export const cookbookAuth = (): any => {
  return DecoratorFactory.createDecorator(async (req, res, next) => {
    const cookbookId = req.params.cookbooks;
    const user = req.user;

    if (cookbookId == null || user == null) {
      return next(createError(401, "Unauthorized"));
    }

    if (user.superAdmin === true) {
      return;
    }

    const cookbookService = new CookbookService();

    try {
      const cookbook = await cookbookService.getById(cookbookId);

      if (cookbook != null && cookbook.authUser(user.id)) {
        return;
      }

      return next(createError(401, "Unauthorized"));
    } catch (err) {
      return next(createError(500, err));
    }
  });
};
