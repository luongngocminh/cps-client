export interface NodeData {
  result: string;
  table: number;
  _start: Date;
  _stop: Date;
  _time: Date;
  _value: number;
  _field: string;
  _measurement: string;
  nodeid: string;
  ntype: string;
}

export interface NodeQuery {
  start: string;
  stop: string;
  measurements: string[];
  nids?: string[];
  ntype?: string[];
  every?: string;
  fn?: string;
}
