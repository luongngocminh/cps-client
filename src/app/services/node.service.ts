import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { INode } from '../interfaces/node.type';
import { NodeData, NodeQuery } from '../models/nodeData.model';
import { API_BASE_ROUTE } from '../share/constants';
import events from '../share/events';

@Injectable()
export class NodeService {
  nodeRegistry = this.socket.fromEvent<{ [key: string]: INode }>(events.node.registryUpdated);
  nodeInfo = this.socket.fromEvent<Partial<NodeData>[]>(events.node.info);
  constructor(private socket: Socket, private http: HttpClient) {}

  getConnectedNodes(): Observable<INode[]> {
    return this.http.get<INode[]>(API_BASE_ROUTE + '/node/');
  }

  queryNodeData(q: NodeQuery) {
    const query = [];
    for (const key in q) {
      if (q[key]) {
        let value = q[key];
        if (Array.isArray(q[key])) {
          value = q[key].join(',');
        }
        query.push(`${key}=${value}`);
      }
    }
    return this.http.get<NodeData[]>(API_BASE_ROUTE + `/data/q?${query.join('&')}`);
  }

  broadcastTriggerCalibration() {
    return this.http.post(API_BASE_ROUTE + '/node/cmd/all/trigger', {});
  }
}
