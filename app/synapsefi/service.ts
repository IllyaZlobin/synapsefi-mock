/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable new-cap */
/* eslint-disable class-methods-use-this */
import { Node, NodeDocument } from "@app/database/schemas/node.schema";
import { Subnet, SubnetDocument } from "@app/database/schemas/subnet.schema";
import { User, UserDocument } from "@app/database/schemas/user.schema";
import { DateUtils } from "@app/utils/date.utils";
import { ShortId } from "@app/utils/id.utils";
import { faker } from "@faker-js/faker";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserCipType } from "./constants/cip-type.enum";
import { WebHookService } from "./webhook.service";

@Injectable()
export class SynapsefiService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Node.name) private readonly nodeModel: Model<NodeDocument>,
    @InjectModel(Subnet.name)
    private readonly subnetModel: Model<SubnetDocument>,
    private readonly whService: WebHookService
  ) {}

  async createUser(i: CreateUserInput) {
    const user = new this.userModel({
      id: ShortId.generate(),
      email: i.email,
      cip_tag: i.cip_tag,
      refresh_token: ShortId.generate(),
    });

    if (i.documents) {
      const documents = i.documents.map((x) => ({
        ...x,
        id: ShortId.generate(),
      }));
      user.documents = documents;
    }

    await user.save();

    await this.whService.triggerKyc(user);
    return {
      ...user,
      _id: user.id,
      refresh_token: user.refresh_token,
      documents: user.documents ?? [],
    };
  }

  async createNode(i: CreateNodeInput) {
    const { type, supp_id, info } = i;
    const user = await this.userModel.findOne({ id: i.userId });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    const node = new this.nodeModel({
      id: ShortId.generate(),
      user,
      type,
      extra: {
        supp_id,
        note: "",
      },
      info,
    });

    await node.save();

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
    const { account_class, nickname, supp_id } = i;

    const node = await this.nodeModel
      .findOne({ id: i.node_id })
      .populate("user");

    if (!node) {
      throw new BadRequestException("Node not found");
    }

    const user = await this.userModel.findOne({ id: i.user_id });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    if (node.user.id !== user.id) {
      throw new BadRequestException("User is not node owner");
    }

    const subnet = new this.subnetModel({
      id: ShortId.generate(),
      supp_id,
      user,
      node,
      account_class,
      nickname,
      status: "ACTIVE",
      status_code: "USER_REQUESTED",
      account_num: faker.finance.account(),
      card_number: faker.finance.creditCardNumber(),
      exp: DateUtils.generateExp(),
      routing_num: {
        ach: faker.finance.routingNumber(),
        wire: faker.finance.routingNumber(),
      },
      cvc: faker.finance.creditCardCVV(),
    });

    await subnet.save();

    await this.whService.triggerSubnet({
      type: "create",
      _rest: {
        supp_id,
        _id: subnet.id,
        status: subnet.status,
        status_code: subnet.status_code,
        node: {
          id: node.id,
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
    const { nodeId, subnetId, userId, status } = i;

    const subnet = await this.subnetModel
      .findOne({ id: subnetId })
      .populate(["user", "node"]);

    if (!subnet) {
      throw new BadRequestException("Subnet not found");
    }

    if (subnet.node.id !== nodeId || subnet.user.id !== userId) {
      throw new BadRequestException("User is not node owner");
    }

    subnet.status = status;

    if (i.supp_id) subnet.supp_id = i.supp_id;

    await subnet.save();

    await this.whService.triggerSubnet({
      type: "update",
      _rest: {
        supp_id: subnet.supp_id,
        _id: subnet.id,
        status: subnet.status,
        status_code: subnet.status_code,
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
  node_id: string;
  user_id: string;
  supp_id: string;
  account_class: string;
  nickname: string;
}
