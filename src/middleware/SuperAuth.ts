import createError from "http-errors";

export const superAuth = (): any => {
  return (target: any, propertyKey: string, descriptor: any) => {
    const fn = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const [req, res, next] = args;
      const user = req.user;
      console.log("🚀 ~ file: SuperAuth.ts:9 ~ user:", user);

      if (user == null || !user.superAdmin) {
        return next(createError(401, "Unauthorized"));
      }

      return fn.apply(this, args);
    };
  };
};
