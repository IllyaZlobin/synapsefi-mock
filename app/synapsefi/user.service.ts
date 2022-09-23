import { User, UserDocument } from "@app/database/schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async isExist(userId: string): Promise<boolean> {
    const user = await this.userModel.findOne({ id: userId });
    return !!user;
  }
}
