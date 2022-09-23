import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";

export class DateUtils {
  static generateExp() {
    const now = DateTime.now();
    return DateTime.now()
      .set({
        year: faker.datatype.number({
          min: now.year + 1,
          max: now.year + 10,
        }),
        month: faker.datatype.number({ min: 1, max: 12 }),
      })
      .toFormat("MM/yy");
  }
}
