import createError from "http-errors";

export const superAuth = (): any => {
  return (target: any, propertyKey: string, descriptor: any) => {
    const fn = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const [req, res, next] = args;
      const user = req.user;

      if (user == null || !user.super_admin) {
        return next(createError(401, "Unauthorized"));
      }

      return fn.apply(this, args);
    };
  };
};
