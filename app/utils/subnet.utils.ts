import { nonNull } from "@app/utils/nonNull";
import { faker } from "@faker-js/faker";

export class SubnetUtils {
  static generateCardNumber(subnetId: string, replace = false) {
    const cardNumber = faker.finance.creditCardNumber(
      "63[7-9]# #### #### ###L"
    );
    const last4 = nonNull(subnetId.split("|").at(-1)).value;

    if (replace) return `0000 0000 0000 ${last4}`;

    return cardNumber.slice(0, -4).concat(last4);
  }

  static getCvv(subnetId: string) {
    const tinySubnetId = nonNull(subnetId.split("|").at(-1)).value;
    const cvc = tinySubnetId.slice(1, 4);
    return cvc;
  }
}
