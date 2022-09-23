import { UserCipType } from "@app/synapsefi/constants/cip-type.enum";
import { IDocument } from "@app/synapsefi/models/document";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  id: string;

  @Prop()
  email: string;

  @Prop({ type: Number, enum: UserCipType })
  cip_tag: UserCipType;

  @Prop([Object])
  documents?: IDocument[];

  @Prop()
  refresh_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
