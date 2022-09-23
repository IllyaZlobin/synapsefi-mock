import { StackContext, use } from "@serverless-stack/resources";
import synapsefiRoutes from "functions/synapsefi/routes";
import { Api } from "stacks/api";

export function SynapsefiLambdaStack({ stack }: StackContext) {
  const { api } = use(Api);
  api.addRoutes(stack, synapsefiRoutes);
}
