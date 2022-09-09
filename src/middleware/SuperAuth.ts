export const superAuth = (): any => {
  return (target: any, propertyKey: string, descriptor: any) => {
    const fn = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      // anything that was passed in the arguments in instance method (it can be empty)
      return fn.apply(this, args);
    };
  };
};
