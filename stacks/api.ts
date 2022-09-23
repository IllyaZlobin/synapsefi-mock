import { Api as SSTApiStack, StackContext } from "@serverless-stack/resources";

export function Api({ app, stack }: StackContext) {
  const api = new SSTApiStack(stack, "Api", {
    cors: {
      allowOrigins: ["*"],
      allowHeaders: ["*"],
      allowMethods: ["ANY"],
    },
  });

  app.addDefaultFunctionEnv({
    API_URL: api.url,
  });
  stack.addOutputs({
    ApiRegion: {
      value: stack.region,
      exportName: app.logicalPrefixedName("ApiRegion"),
    },
    ApiEndpoint: {
      value: api.url,
      exportName: app.logicalPrefixedName("ApiEndpoint"),
    },
  });
  return { api };
}
