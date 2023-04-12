import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { interval, Observable } from 'rxjs';
import { first, mergeMap, takeWhile } from 'rxjs/operators';
import { INode } from '../../interfaces/node.type';
import { NodeQuery } from '../../models/nodeData.model';
import { NodeService } from '../../services/node.service';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
  providers: [NodeService],
})
export class DashboardComponent implements OnInit, OnDestroy {
  sensorNodes: INode[] = [];
  stationNodes: INode[] = [];
  alive: boolean = true;
  // multi = {
  //   station: {
  //     temperature: [],
  //     battery: [],
  //     rtc: [],
  //   },
  //   sensor: {
  //     temperature: [],
  //     battery: [],
  //     rtc: [],
  //   },
  // };
  // showLegend = true;
  // showXAxis = true;
  // showYAxis = true;
  // showXAxisLabel = true;
  // showYAxisLabel = true;
  tablesettings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      perPage: 50,
    },
    columns: {
      _time: {
        title: 'Time',
        type: 'Date',
      },
      _measurement: {
        title: 'Measurement',
        type: 'string',
      },
      _value: {
        title: 'Value',
        type: 'number',
      },
      nodeid: {
        title: 'Node ID',
        type: 'string',
      },
      ntype: {
        title: 'Node Type',
        type: 'string',
      },
    },
  };
  currentStationId: number = -1;

  get filteredSensorNodes(): INode[] {
    return this.sensorNodes.filter(node =>
      this.currentStationId === -1 ? node : node.parent === this.currentStationId,
    );
  }

  tablesource: LocalDataSource = new LocalDataSource();
  constructor(private nodeService: NodeService, private toastrService: NbToastrService) {
    this.nodeService
      .getConnectedNodes()
      .pipe(first())
      .subscribe(nodes => {
        for (const node of nodes) {
          if (node.type === 0) {
            this.sensorNodes = [...this.sensorNodes, node];
          } else {
            this.stationNodes = [...this.stationNodes, node];
          }
        }
      });

    this.nodeService.nodeRegistry.pipe(takeWhile(() => this.alive)).subscribe(nodeRegistry => {
      this.sensorNodes = [];
      this.stationNodes = [];
      for (const node of Object.values(nodeRegistry)) {
        if (node.status !== 0) {
          this.toastrService.danger(
            `A Node <${node.type ? 'sensor' : 'station'}> ID: ${node.nid} has been faulty`,
            'Node Exception',
            {
              duration: 50_000,
            },
          );
        }
        if (node.type === 0) {
          this.sensorNodes = [...this.sensorNodes, node];
        } else {
          this.stationNodes = [...this.stationNodes, node];
        }
      }
    });

    // this.nodeService.nodeInfo.pipe(takeWhile(() => this.alive)).subscribe(infos => {
    //   console.log('infos', infos);
    //   infos.forEach(info => {
    //     this.tablesource.add(info);
    //   });
    // });
  }

  ngOnInit() {
    // const unpackData = (nid, ntype, measurement, array) => {
    //   return array
    //     .filter(obj => obj.nodeid === '' + nid && obj.ntype === ntype && obj._measurement === measurement)
    //     .map(obj => Object.assign({}, { name: new Date(obj['_time']), value: obj['_value'] ?? 0 }));
    // };
    const q: NodeQuery = {
      start: '-5h',
      stop: '0h',
      measurements: ['battery', 'rtc', 'temperature'],
      every: '20s',
    };
    interval(5_000)
      .pipe(
        mergeMap(() => this.nodeService.queryNodeData(q)),
        takeWhile(() => this.alive),
      )
      .subscribe(response => {
        this.tablesource.load(response.reverse());
      });
  }

  changeStation(e) {
    this.currentStationId = e.target.value;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
