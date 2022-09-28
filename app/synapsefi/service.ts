/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable new-cap */
/* eslint-disable class-methods-use-this */
import { Node } from "@app/synapsefi/models/node";
import { Subnet } from "@app/synapsefi/models/subnet";
import { User } from "@app/synapsefi/models/user";
import { DateUtils } from "@app/utils/date.utils";
import { IdUtils } from "@app/utils/id.utils";
import { nonNull } from "@app/utils/nonNull";
import { SubnetUtils } from "@app/utils/subnet.utils";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { UserCipType } from "./constants/cip";
import { WebHookService } from "./webhook.service";

@Injectable()
export class SynapsefiService {
  constructor(private readonly whService: WebHookService) {}

  async createUser(i: CreateUserInput) {
    const user = new User({
      id: IdUtils.generateUserId(i.cip_tag),
      email: i.email,
      cip_tag: i.cip_tag,
      refresh_token: "",
    });

    if (i.documents) {
      const documents = i.documents.map((x) => ({
        ...x,
        id: IdUtils.generate(),
      }));
      user.documents = documents;
    }

    await this.whService.triggerKyc(user);
    return {
      ...user,
      _id: user.id,
      refresh_token: user.refresh_token,
      documents: user.documents ?? [],
    };
  }

  async createNode(i: CreateNodeInput) {
    const { type, supp_id, info, userId } = i;

    const node = new Node({
      id: IdUtils.generateNodeId(userId),
      type,
      info,
      userId,
      extra: { note: "", supp_id },
    });

    await this.whService.triggerNode({
      _rest: {
        _id: node.id,
        document_id: info.document_id,
        nickname: info.nickname,
        is_active: true,
        extra: { supp_id },
      },
    });

    return node;
  }

  async createSubnet(i: CreateSubnetInput) {
    const { account_class, nickname, suppId, nodeId, userId } = i;

    const id = IdUtils.generateSubnetId(userId, nodeId);

    const subnet = new Subnet({
      id,
      supp_id: suppId,
      userId,
      nodeId,
      account_class,
      nickname,
      status: "ACTIVE",
      status_code: "USER_REQUESTED",
      account_num: faker.finance.account(),
      card_number: SubnetUtils.generateCardNumber(id),
      exp: DateUtils.generateExp(),
      routing_num: {
        ach: faker.finance.routingNumber(),
        wire: faker.finance.routingNumber(),
      },
      cvc: SubnetUtils.getCvv(id),
    });

    await this.whService.triggerSubnet({
      type: "create",
      _rest: {
        supp_id: suppId,
        _id: subnet.id,
        status: nonNull(subnet.status).value,
        status_code: nonNull(subnet.status_code).value,
        node: {
          id: nodeId,
        },
        account_num: subnet.account_num,
        card_number: subnet.card_number,
        exp: subnet.exp,
        routing_num: subnet.routing_num,
      },
    });

    return { _id: subnet.id, routing_num: subnet.routing_num };
  }

  async updateSubnet(i: UpdateSubnetInput) {
    const { nodeId, subnetId, userId, status, supp_id } = i;

    const subnet = new Subnet({
      id: subnetId,
      supp_id,
      userId,
      nodeId,
      status: "ACTIVE",
      status_code: "USER_REQUESTED",
    });

    subnet.status = status;

    if (i.supp_id) subnet.supp_id = i.supp_id;

    await this.whService.triggerSubnet({
      type: "update",
      _rest: {
        supp_id: subnet.supp_id ?? "",
        _id: subnet.id,
        status: subnet.status,
        status_code: nonNull(subnet.status_code).value,
        node: { id: nodeId },
      },
    });

    return subnet;
  }

  async test() {
    return "test";
  }
}

interface CreateUserInput {
  email: string;
  cip_tag: UserCipType;
  documents?: {
    email: string;
    phone_number: string;
    ip: string;
    company_activity?: string[];
    name: string;
    ownership_percentage?: number;
    title?: string;
    entity_type: string;
    entity_scope: string;
    day: number;
    month: number;
    year: number;
    address_street: string;
    address_city: string;
    address_subdivision: string;
    address_postal_code: string;
    address_country_code: string;
    physical_docs: {
      document_value: string;
      document_type: string;
      id?: string | undefined;
      meta: {
        country_code: string;
      };
    }[];
    virtual_docs?: {
      document_value: string;
      document_type: string;
      meta: { country_code: string };
    }[];
    social_docs?: {
      document_value: string;
      document_type: string;
      meta: {
        address_street: string;
        address_city: string;
        address_subdivision: string;
        address_postal_code: string;
        address_country_code: string;
        address_care_of: string;
      };
    }[];
  }[];
}

interface CreateNodeInput {
  userId: string;
  supp_id: string;
  type: string;
  info: {
    nickname: string;
    document_id: string;
  };
}

interface UpdateSubnetInput {
  userId: string;
  supp_id?: string;
  nodeId: string;
  subnetId: string;
  status: "ACTIVE" | "INACTIVE";
}

interface CreateSubnetInput {
  nodeId: string;
  userId: string;
  suppId: string;
  account_class: string;
  nickname: string;
}
