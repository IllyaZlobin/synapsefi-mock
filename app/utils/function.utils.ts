import { LambdaInterceptorsRegistry } from "@app/core/lambda-interceptors.registry";
import {
  DynamicModule,
  HttpException,
  INestApplicationContext,
  Logger,
  Type,
} from "@nestjs/common";
import { ContextIdFactory, NestFactory } from "@nestjs/core";
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  Context,
  Handler,
} from "aws-lambda";
import { Body } from "aws-sdk/clients/s3";
import { Readable } from "stream";

export type HandlerNoCallback<THandler extends Handler> =
  THandler extends Handler<infer TEvent, infer TResult>
    ? (event: TEvent, context: Context) => Promise<TResult>
    : never;

/**
 * If error is instance of HttpException then returns proper status code and message instead of generic 500 status code.
 */
export function withHttpErrors<TResult>(
  handler: HandlerNoCallback<APIGatewayProxyHandlerV2<TResult>>
): HandlerNoCallback<APIGatewayProxyHandlerV2<TResult>> {
  return async (e, ctx) => {
    try {
      return await handler(e, ctx);
    } catch (err) {
      const logger = new Logger("ExceptionHandler");
      const stack = err instanceof Error ? err.stack : undefined;
      logger.error(
        `An exception occurred while executing lambda function at ${e.rawPath}`,
        stack
      );
      if (err instanceof HttpException) {
        return {
          statusCode: err.getStatus(),
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(err.getResponse(), null, 2),
        };
      }
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            message: "Internal Server Error",
          },
          null,
          2
        ),
      };
    }
  };
}

const cachedApps = new Map<any, INestApplicationContext>();
/**
 * Re-use the application context across function invocations
 */
async function bootstrap(module: any) {
  let app = cachedApps.get(module);
  if (!app) {
    const dynamicModule: DynamicModule = {
      module,
      providers: [
        {
          provide: LambdaInterceptorsRegistry,
          useValue: new LambdaInterceptorsRegistry(),
        },
      ],
    };
    app = await NestFactory.createApplicationContext(dynamicModule);
    cachedApps.set(module, app);
  }
  return app;
}

export interface NestHandlerAppContext {
  /**
   * Retrieves an instance of either injectable or controller, otherwise, throws exception.
   * @returns {TResult}
   */
  resolve<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | string | symbol,
    options?: {
      strict: boolean;
    }
  ): Promise<TResult>;
}

type NestJsHandler<THandler extends Handler> = THandler extends (
  ...a: infer U
) => infer R
  ? (app: NestHandlerAppContext, ...a: U) => R
  : never;

type GuardHandler = (
  app: NestHandlerAppContext,
  e: APIGatewayProxyEventV2
) => Promise<boolean>;

async function acceptGuards(
  appContext: NestHandlerAppContext,
  e: APIGatewayProxyEventV2,
  guards?: GuardHandler[]
): Promise<boolean> {
  let allowNext = true;
  /* const allGuards = [...globalGuards, ...(guards || [])];
  if (allGuards?.length) {
    const guardResults = await Promise.all(
      allGuards.map(async (mw) => mw(appContext, e))
    );
    allowNext = guardResults.every(Boolean);
  } */
  return allowNext;
}

export function withNestJs<THandler extends Handler>(
  module: any,
  handler: NestJsHandler<HandlerNoCallback<THandler>>,
  guards?: GuardHandler[]
): HandlerNoCallback<THandler> {
  return (async (event: any, context: Context) => {
    const app = await bootstrap(module);
    const contextId = ContextIdFactory.create();
    app.registerRequestByContextId({ event, context }, contextId);
    const appContext: NestHandlerAppContext = {
      resolve: (typeOrToken, options) =>
        app.resolve(typeOrToken, contextId, options),
    };
    const interceptorsRegistry = app.get(LambdaInterceptorsRegistry);
    const interceptedHandler = interceptorsRegistry.applyTo(async (e, ctx) => {
      const allowNext = await acceptGuards(appContext, e, guards);
      if (allowNext) {
        return handler(appContext, e, ctx);
      }
      return null;
    });
    return await interceptedHandler(event, context);
  }) as any;
}

function getStringFromBuffer(buffer: Buffer): string {
  return buffer.toString("utf8");
}

export async function getStringFromStream(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Array<Uint8Array> = [];

    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

async function getBase64StringFromStream(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Array<Uint8Array> = [];

    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("base64")));
  });
}
function getBase64StringFromBuffer(buffer: Buffer): string {
  return buffer.toString("base64");
}
export async function getStringFromBody(body: Body): Promise<string> {
  if (body instanceof Buffer) {
    return Promise.resolve(getStringFromBuffer(body));
  }
  if (body instanceof Readable) {
    return await getStringFromStream(body);
  }
  return body.toString();
}
export async function getBase64StringFromBody(body: Body): Promise<string> {
  if (body instanceof Buffer) {
    return Promise.resolve(getBase64StringFromBuffer(body));
  }
  if (body instanceof Readable) {
    return await getBase64StringFromStream(body);
  }
  throw new Error(`wrong body type:${typeof body}`);
}

export function getSuccessfulRespObj(dataToStringify: any): {
  headers: any;
  statusCode: number;
  body: string;
} {
  return {
    headers: {
      "Content-Type": "application/json",
    },
    statusCode: 200,
    body: JSON.stringify(dataToStringify, null, 2),
  };
}
export function getDayRange(
  startDay: Date,
  endDay: Date
): { start: Date; end: Date } {
  return {
    start: new Date(startDay.setUTCHours(0, 0, 0, 0)),
    end: new Date(endDay.setUTCHours(23, 59, 59, 999)),
  };
}
/**
  Remove empty keys from object
*/
export function clearObject(
  obj: Record<string, unknown>,
  excludeValues: Array<unknown>
): Record<string, unknown> {
  const newObj: Record<string, unknown> = {};

  Object.keys(obj).forEach((k) => {
    const val = obj[k];
    if (!excludeValues.includes(val)) {
      newObj[k] = val;
    }
  });
  return newObj;
}
