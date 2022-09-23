type LambdaFunction = (event: any, context: any) => Promise<any>;

type LambdaInterceptor = (
  event: any,
  context: any,
  next: LambdaFunction
) => Promise<any>;

export class LambdaInterceptorsRegistry {
  private readonly interceptors: LambdaInterceptor[] = [];

  add(interceptor: LambdaInterceptor) {
    this.interceptors.push(interceptor);
  }

  applyTo(fn: LambdaFunction): LambdaFunction {
    let resultFn = fn;
    for (let i = 0; i < this.interceptors.length; i += 1) {
      const interceptor = this.interceptors[i];
      const currentFn = resultFn;
      resultFn = (e, ctx) => interceptor(e, ctx, currentFn);
    }
    return resultFn;
  }
}
