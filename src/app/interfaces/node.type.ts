export interface INode {
  latestConnectedAt: Date;
  nextTriggerAt?: string;
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
