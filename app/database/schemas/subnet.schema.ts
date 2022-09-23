import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Node } from "./node.schema";
import { User } from "./user.schema";

export type SubnetDocument = Subnet & Document;

@Schema()
export class Subnet {
  @Prop()
  id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Node.name })
  node: Node;

  @Prop()
  supp_id: string;

  @Prop()
  account_class: string;

  @Prop()
  nickname: string;

  @Prop({ type: String })
  status: "INACTIVE" | "TERMINATED" | "ACTIVE";

  @Prop({ type: String })
  status_code:
    | "USER_REQUESTED"
    | "FRAUD_ALERT"
    | "ACCOUNT_CLOSED"
    | "ACCOUNT_LOCKED"
    | "NOT_KNOWN";

  // Additional fields for Cards

  @Prop({ required: false })
  card_number?: string;

  @Prop({ required: false })
  cvc?: string;

  @Prop({ required: false })
  pin?: string;

  @Prop({ required: false })
  exp?: string;

  @Prop({ required: false })
  card_style_id?: string;

  @Prop({ required: false })
  wallet_style_id?: string;

  @Prop({ type: Object, required: false })
  preferences?: SubnetCardPreferences;

  // Additional field for Account Numbers
  @Prop({ required: false })
  account_num?: string;

  @Prop({ type: Object, required: false })
  routing_num?: SubnetRoutingNumber;
}

export const SubnetSchema = SchemaFactory.createForClass(Subnet);

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
