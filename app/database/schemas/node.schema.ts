import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "./user.schema";

export type NodeDocument = Node & Document;

@Schema()
export class Node {
  @Prop()
  id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop()
  type: string;

  @Prop({ type: Object })
  extra: NodeExtra;

  @Prop({ type: Object })
  info: NodeInfo;
}

export const NodeSchema = SchemaFactory.createForClass(Node);

export interface NodeExtra {
  supp_id: string;
  note: string;
}

export interface NodeInfo {
  nickname: string;
  document_id: string;
}
