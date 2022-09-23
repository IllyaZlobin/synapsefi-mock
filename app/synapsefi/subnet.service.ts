/* eslint-disable consistent-return */
import { Node, NodeDocument } from "@app/database/schemas/node.schema";
import { Subnet, SubnetDocument } from "@app/database/schemas/subnet.schema";
import { User, UserDocument } from "@app/database/schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

export class SubnetService {
  constructor(
    @InjectModel(Subnet.name) private subnetModel: Model<SubnetDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Node.name) private nodeModel: Model<NodeDocument>
  ) {}

  async getOne(i: GetOneInput) {
    const subnet = await this.subnetModel
      .findOne({ id: i.subnetId })
      .populate(["user", "node"])
      .exec();
    if (
      subnet &&
      (subnet.user.id !== i.userId || subnet.node.id !== i.nodeId)
    ) {
      return;
    }

    return subnet;
  }

  async getAll(i: GetAllInput) {
    const user = await this.userModel.findOne({ id: i.userId });
    const node = await this.nodeModel.findOne({ id: i.nodeId });

    if (!user || !node) {
      return [];
    }

    return this.subnetModel
      .find({ node, user })
      .populate(["user", "node"])
      .exec();
  }
}

interface GetOneInput {
  userId: string;
  nodeId: string;
  subnetId: string;
}

interface GetAllInput {
  userId: string;
  nodeId: string;
}
