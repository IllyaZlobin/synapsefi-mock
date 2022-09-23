import { App } from "@serverless-stack/resources";
import { Api } from "stacks/api";
import { SynapsefiLambdaStack } from "stacks/synapsefi";

export default function (app: App) {
  app.setDefaultRemovalPolicy("destroy");

  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    timeout: 30,
    architecture: "arm_64",
    bundle: {
      externalModules: [
        "@nestjs/axios",
        "@nestjs/common",
        "@nestjs/config",
        "@nestjs/core",
        "@nestjs/swagger",
        "class-transformer",
        "class-validator",
        "luxon",
        "synapsenode",
        "uuid",
        "request",
        "aws-sdk",
        "knex",
        "@nestjs/platform-express",
      ],
      minify: false,
      esbuildConfig: {
        plugins: "esbuild.plugins.js",
      },
    },
    environment: {
      NODE_ENV: process.env.NODE_ENV || "dev",
      SST_STAGE: app.stage,
      SST_APP_NAME: app.name,
      WIREBEE_API_URL: process.env.WIREBEE_API_URL || "",
      SYNAPSE_WEBHOOK_SIGNATURE: process.env.SYNAPSE_WEBHOOK_SIGNATURE || "",
    },
  });

  app.stack(Api).stack(SynapsefiLambdaStack);
}
