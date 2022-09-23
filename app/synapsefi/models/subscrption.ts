export interface ISubscription {
  url: string;
  scope: string[];
  type: "subnet" | "decision" | "node" | "kyc" | "transaction";
}
