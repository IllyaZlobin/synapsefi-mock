import { UserCipType } from "../constants/cip";
import { IDocument } from "./document";

export interface IUser {
  id: string;
  cip_tag: UserCipType;
  email?: string;
  documents?: IDocument[];
}

export class User implements IUser {
  id: string;

  cip_tag: UserCipType;

  email?: string | undefined;

  documents?: IDocument[] | undefined;

  refresh_token?: string;

  constructor(i: UserInput) {
    this.id = i.id;
    this.cip_tag = i.cip_tag;
    this.email = i.email;
    this.documents = i.documents;
    this.refresh_token = i.refresh_token;
  }
}

export interface UserInput {
  id: string;
  cip_tag: UserCipType;
  email?: string;
  documents?: IDocument[];
  refresh_token?: string;
}
