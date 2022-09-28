export interface INode {
  id: string;
  type: string;
  extra: NodeExtra;
  info: NodeInfo;
}

export class Node implements INode {
  id: string;

  userId: string;

  type: string;

  extra: NodeExtra;

  info: NodeInfo;

  constructor(i: NodeInput) {
    this.id = i.id;
    this.userId = i.userId;
    this.type = i.type;
    this.extra = i.extra;
    this.info = i.info;
  }
}

export interface NodeExtra {
  supp_id: string;
  note: string;
}

export interface NodeInfo {
  nickname: string;
  document_id: string;
}

export interface NodeInput {
  id: string;
  userId: string;
  type: string;
  extra: NodeExtra;
  info: NodeInfo;
}
