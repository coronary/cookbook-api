import createError from "http-errors";

export const cookbookId = (): any => {
  return (target: any, propertyKey: string, descriptor: any) => {
    const fn = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const [req, res, next] = args;
      const cookbookId = req.params.cookbooks;

      if (cookbookId == null) {
        return next(createError(404, "Cookbook not found"));
      }

      req.body.cookbook = cookbookId;
      return fn.apply(this, args);
    };
  };
};
