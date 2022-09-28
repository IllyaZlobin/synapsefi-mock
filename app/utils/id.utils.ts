import {
  UserCipOneId,
  UserCipThreeId,
  UserCipType,
} from "@app/synapsefi/constants/cip";
import { faker } from "@faker-js/faker";
import shortid from "shortid";

export class IdUtils {
  static generate(): string {
    return shortid.generate();
  }

  static generateUserId(cip_tag: UserCipType): string {
    const id = cip_tag === UserCipType.cip_one ? UserCipOneId : UserCipThreeId;
    return `${id}-${faker.random.alphaNumeric(4)}`;
  }

  static generateNodeId(userId: string) {
    return `${userId}|${shortid.generate()}`;
  }

  static generateSubnetId(userId: string, nodeId: string) {
    return `${userId}|${nodeId}|${faker.random.numeric(4)}`;
  }
}
