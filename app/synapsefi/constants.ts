import { nonNull } from "@app/utils/nonNull";
import { ISubscription } from "./models/subscrption";

export const WIREBEE_API_URL = nonNull(
  process.env.WIREBEE_API_URL,
  "process.env.WIREBEE_API_URL"
);

export const SYNAPSE_WEBHOOK_SIGNATURE = nonNull(
  process.env.SYNAPSE_WEBHOOK_SIGNATURE,
  "process.env.SYNAPSE_WEBHOOK_SIGNATURE"
);

export const subscriptions: ISubscription[] = [
  {
    url: `${WIREBEE_API_URL.value}/webhook/subnet`,
    scope: ["SUBNETS|POST", "SUBNET|PATCH"],
    type: "subnet",
  },
  {
    url: `${WIREBEE_API_URL.value}/webhook/decision`,
    scope: ["TRANS|POST|JIT"],
    type: "decision",
  },
  {
    url: `${WIREBEE_API_URL.value}/webhook/node`,
    scope: ["NODES|POST", "NODE|PATCH"],
    type: "node",
  },
  {
    url: `${WIREBEE_API_URL.value}/webhook/kyc`,
    scope: ["USERS|POST", "USER|PATCH"],
    type: "kyc",
  },
  {
    url: `${WIREBEE_API_URL.value}/webhook/transaction`,
    scope: ["TRANS|POST", "TRAN|PATCH"],
    type: "transaction",
  },
];
