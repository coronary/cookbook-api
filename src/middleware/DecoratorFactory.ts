export class DecoratorFactory {
  public static createDecorator(
    decoratorFunction: (req, res, next) => Promise<any> | null
  ) {
    return (target: any, propertyKey: string, descriptor: any) => {
      const fn = descriptor.value;
      descriptor.value = async function (...args: any[]) {
        const [req, res, next] = args;
        await decoratorFunction(req, res, next);
        return fn.apply(this, args);
      };
    };
  }
}
