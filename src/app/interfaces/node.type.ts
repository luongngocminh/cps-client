export interface INode {
  latestConnectedAt: Date;
  status: number;
  parent?: number;
  _id: string;
  nid: number;
  type: number;
  __v: number;
  battery: number;
  createdAt: Date;
  rtc: number;
  updatedAt: Date;
  temperature: number;
}
