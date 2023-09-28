import createError from "http-errors";
import { DecoratorFactory } from "./DecoratorFactory";

export const superAuth = (): any => {
  return DecoratorFactory.createDecorator((req, res, next) => {
    const user = req.user;

    if (user == null || !user.superAdmin) {
      return next(createError(401, "Unauthorized"));
    }
  });
};
