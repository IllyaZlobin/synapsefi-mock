export class Subnet {
  id: string;

  userId: string;

  nodeId: string;

  supp_id?: string;

  account_class?: string;

  nickname?: string;

  status?: "INACTIVE" | "TERMINATED" | "ACTIVE";

  status_code?:
    | "USER_REQUESTED"
    | "FRAUD_ALERT"
    | "ACCOUNT_CLOSED"
    | "ACCOUNT_LOCKED"
    | "NOT_KNOWN";

  // Additional fields for Cards

  card_number?: string;

  cvc?: string;

  pin?: string;

  exp?: string;

  card_style_id?: string;

  wallet_style_id?: string;

  preferences?: SubnetCardPreferences;

  // Additional field for Account Numbers
  account_num?: string;

  routing_num?: SubnetRoutingNumber;

  constructor(i: SubnetInput) {
    this.id = i.id;
    this.userId = i.userId;
    this.nodeId = i.nodeId;
    this.supp_id = i.supp_id;
    this.account_class = i.account_class;
    this.nickname = i.nickname;
    this.status = i.status;
    this.status_code = i.status_code;
    this.card_number = i.card_number;
    this.cvc = i.cvc;
    this.pin = i.pin;
    this.exp = i.exp;
    this.card_style_id = i.card_style_id;
    this.wallet_style_id = i.wallet_style_id;
    this.preferences = i.preferences;
    this.account_num = i.account_num;
    this.routing_num = i.routing_num;
  }
}

export interface SubnetInput {
  id: string;

  userId: string;

  nodeId: string;

  supp_id?: string;

  account_class?: string;

  nickname?: string;

  status?: "INACTIVE" | "TERMINATED" | "ACTIVE";

  status_code?:
    | "USER_REQUESTED"
    | "FRAUD_ALERT"
    | "ACCOUNT_CLOSED"
    | "ACCOUNT_LOCKED"
    | "NOT_KNOWN";

  // Additional fields for Cards

  card_number?: string;

  cvc?: string;

  pin?: string;

  exp?: string;

  card_style_id?: string;

  wallet_style_id?: string;

  preferences?: SubnetCardPreferences;

  // Additional field for Account Numbers
  account_num?: string;

  routing_num?: SubnetRoutingNumber;
}

export interface SubnetCardPreferences {
  allow_foreign_transactions?: boolean;
  daily_transaction_limit?: number | null;
  daily_cash_limit?: number | null;
  monthly_transaction_limit?: number | null;
  monthly_cash_limit?: number | null;
}

export interface SubnetRoutingNumber {
  wire: string;
  ach: string;
}
