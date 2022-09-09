export const auth = (): any => {
  return (target: any, propertyKey: string, descriptor: any) => {
    const fn = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const req = args[0];
      const res = args[1];
      const next = args[3];
      const user = req.user;
      console.log("AUTHENTICATING...: ", user);
      return fn.apply(this, args);
    };
  };
};
