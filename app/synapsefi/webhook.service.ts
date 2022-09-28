/* eslint-disable class-methods-use-this */
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom, lastValueFrom } from "rxjs";
import { CipPermission, UserCipType } from "./constants/cip";
import { IDocument } from "./models/document";
import { IUser } from "./models/user";

export interface KycWhBody {
  _id: { $oid: string }; // userId
  permission: CipPermission;
  documents: IDocument[];
}

export interface TriggerNodeInput {
  _rest: {
    _id: string; // synapse node id
    is_active: boolean;
    nickname: string;
    document_id: string;
    extra: {
      supp_id: string; // node id
    };
  };
}

export interface TriggerSubnetInput {
  type: "create" | "update";
  _rest: {
    supp_id: string; // cardId
    _id: string; // synapsefi subnet id
    status: "ACTIVE" | "TERMINATED" | "INACTIVE";
    status_code:
      | "USER_REQUESTED"
      | "FRAUD_ALERT"
      | "ACCOUNT_CLOSED"
      | "ACCOUNT_LOCKED"
      | "NOT_KNOWN";
    card_number?: string;
    exp?: string;
    routing_num?: {
      ach: string;
      wire: string;
    };
    account_num?: string;
    node: {
      id: string;
    };
  };
}

@Injectable()
export class WebHookService {
  constructor(private readonly httpService: HttpService) {}

  async triggerKyc(user: IUser) {
    const body: KycWhBody = {
      _id: { $oid: user.id },
      permission: this.mapPermissions(user.cip_tag),
      documents: user.documents ?? [], // send empty array because mock only success case
    };
    setTimeout(async () => {
      await lastValueFrom(this.httpService.post("/webhook/kyc", body));
    }, 5000);
  }

  async triggerNode(i: TriggerNodeInput) {
    setTimeout(async () => {
      await lastValueFrom(
        this.httpService.post("/webhook/node", {
          ...i,
          webhook_meta: { date: { $date: Date.now() }, function: "NODES|POST" },
        })
      );
    }, 5000);
  }

  async triggerSubnet(i: TriggerSubnetInput) {
    setTimeout(async () => {
      await firstValueFrom(
        this.httpService.post("/webhook/subnet", {
          ...i,
          webhook_meta: {
            date: { $date: Date.now() },
            function: i.type === "create" ? "SUBNETS|POST" : "SUBNET|PATCH",
          },
        })
      );
    }, 5000);
  }

  private mapPermissions(cipType: UserCipType): CipPermission {
    return cipType === UserCipType.cip_three ? "RECEIVE" : "SEND-AND-RECEIVE";
  }
}
