import { UserCipType } from "../constants/cip-type.enum";
import { IDocument } from "./document";

export interface IUser {
  id: string;
  cip_tag: UserCipType;
  email?: string;
  documents?: IDocument[];
}
