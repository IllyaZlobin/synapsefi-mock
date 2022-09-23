import shortid from "shortid";

export class ShortId {
  static generate(): string {
    return shortid.generate();
  }

  static generateUserId(): string {
    return `${shortid.generate()}|${Date.now()}`;
  }
}
