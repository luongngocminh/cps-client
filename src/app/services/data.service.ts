import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NodeData, NodeQuery } from '../models/nodeData.model';
import { API_BASE_ROUTE } from '../share/constants';

@Injectable()
export class DataService {
  constructor(private http: HttpClient) { }

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
}
