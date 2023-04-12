import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { interval } from 'rxjs';
import { first, mergeMap, takeWhile } from 'rxjs/operators';
import { INode } from '../../interfaces/node.type';
import { NodeQuery } from '../../models/nodeData.model';
import { NodeService } from '../../services/node.service';
import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';
import { BaseChartDirective } from 'ng2-charts';
import { GRAPH_COLORS } from '../../share/constants';

@Component({
  selector: 'ngx-sensors',
  styleUrls: ['./sensors.component.scss'],
  templateUrl: './sensors.component.html',
  providers: [NodeService],
})
export class SensorsComponent implements OnInit, OnDestroy {
  alive: boolean = true;
  public chartOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          tooltipFormat: 'h:mm a',
        },
        // add this:
        adapters: {
          date: {
            locale: enUS,
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 1,
      },
      point: {
        borderWidth: 1,
      },
    },
  };

  // vna is -589
  // voff is random int value from -909 to -908
  // von is random int value from -909 to -908
  // ip is int 5486 +- 1
  // vshift is int 320 +- 1
  // chartjs options for each of these with min and max values but padding about +-500 of the range
  //
  vnaColors = this.pickRandomFromGraphColors();
  voffColors = this.pickRandomFromGraphColors();
  vonColors = this.pickRandomFromGraphColors();
  ipColors = this.pickRandomFromGraphColors();
  vshiftColors = this.pickRandomFromGraphColors();
  tempColors = this.pickRandomFromGraphColors();
  batteryColors = this.pickRandomFromGraphColors();

  vnaOption = {
    responsive: true,
    ...this.chartOptions,
    backgroundColor: this.vnaColors,
    borderColor: this.vnaColors,
    pointBackgroundColor: this.vnaColors,
    scales: {
      ...this.chartOptions.scales,
      y: {
        min: -1000,
        max: -200,
      },
    },
  };
  voffOption = {
    ...this.chartOptions,
    responsive: true,
    backgroundColor: this.voffColors,
    borderColor: this.voffColors,
    pointBackgroundColor: this.voffColors,
    scales: {
      ...this.chartOptions.scales,
      y: {
        min: -1200,
        max: -500,
      },
    },
  };
  vonOption = {
    ...this.chartOptions,
    responsive: true,
    backgroundColor: this.vonColors,
    borderColor: this.vonColors,
    pointBackgroundColor: this.vonColors,
    scales: {
      ...this.chartOptions.scales,
      y: {
        min: -1200,
        max: -500,
      },
    },
  };
  ipOption = {
    ...this.chartOptions,
    responsive: true,
    backgroundColor: this.ipColors,
    borderColor: this.ipColors,
    pointBackgroundColor: this.ipColors,
    scales: {
      ...this.chartOptions.scales,
      y: {
        min: 5100,
        max: 5800,
      },
    },
  };
  vshiftOption = {
    ...this.chartOptions,
    responsive: true,
    backgroundColor: this.vshiftColors,
    borderColor: this.vshiftColors,
    pointBackgroundColor: this.vshiftColors,
    scales: {
      ...this.chartOptions.scales,
      y: {
        min: -180,
        max: 180,
      },
    },
  };
  tempOption = {
    ...this.chartOptions,
    responsive: true,
    backgroundColor: this.tempColors,
    borderColor: this.tempColors,
    pointBackgroundColor: this.tempColors,
    scales: {
      ...this.chartOptions.scales,
      y: {
        min: -20,
        max: 50,
      },
    },
  };
  battOption = {
    ...this.chartOptions,
    responsive: true,
    backgroundColor: this.batteryColors,
    borderColor: this.batteryColors,
    pointBackgroundColor: this.batteryColors,
    scales: {
      ...this.chartOptions.scales,
      y: {
        min: 0,
        max: 200,
      },
    },
  };

  nodes: INode[] = [];
  currentNode: Partial<INode> = {
    battery: 0,
  };
  multiTemp = [];
  multiRTC = [];
  multiBatt = [];
  multiIp = [];
  multiVshift = [];
  multiVon = [];
  multiVna = [];
  multiVoff = [];
  labelTemp = [];
  labelRTC = [];
  labelBatt = [];
  labelIp = [];
  labelVshift = [];
  labelVon = [];
  labelVna = [];
  labelVoff = [];
  currentNodeId: number;
  nodeType: string;
  tablesource: LocalDataSource = new LocalDataSource();
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
  @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;
  constructor(private nodeService: NodeService, private route: ActivatedRoute, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
    this.currentNodeId = +this.route.snapshot.params['id'];
    this.nodeType = this.route.snapshot.params['ntype'];
    this.nodeService
      .getConnectedNodes()
      .pipe(first())
      .subscribe(nodes => {
        for (const node of nodes) {
          if (node.type === (this.nodeType === 'sensor' ? 0 : 1)) {
            this.nodes = [...this.nodes, node];
          }
        }
        if (isNaN(this.currentNodeId)) {
          this.router.navigate(['/pages/node/' + this.nodeType + '/' + this.nodes[0].nid]);
        }
        this.currentNode = this.nodes.find(n => n.nid === this.currentNodeId);
      });

    this.nodeService.nodeRegistry.pipe(takeWhile(() => this.alive)).subscribe(nodeRegistry => {
      this.currentNode = nodeRegistry['ss-' + this.currentNodeId];
    });
  }
  changedNode(nid: number) {
    this.router.navigate([`/pages/node/${this.nodeType}/${nid}`]);
  }
  ngOnInit(): void {
    this.getNodeHealth();
  }

  pickRandomFromGraphColors() {
    return GRAPH_COLORS[Math.floor(Math.random() * GRAPH_COLORS.length)];
  }

  getNodeHealth() {
    const unpackData = (measurement, array) => {
      return array
        .filter(obj => obj._measurement === measurement && obj._value)
        .map(obj => Object.assign({}, { x: new Date(obj['_time']), y: obj['_value'] ?? 0 }));
    };
    const q: NodeQuery = {
      start: '-3h',
      stop: '0h',
      nids: ['' + this.currentNodeId],
      ntype: [this.nodeType],
      measurements: ['battery', 'rtc', 'temperature', 'v_p', 'i_p', 'v_on', 'v_off', 'v_shift', 'v_na'],
      every: '20s',
    };
    this.nodeService
      .queryNodeData(q)
      .pipe(first())
      .subscribe(response => {
        const reversed = [...response];
        this.tablesource.load(reversed.reverse());
      });
    interval(5_000)
      .pipe(
        mergeMap(() => this.nodeService.queryNodeData(q)),
        takeWhile(() => this.alive),
      )
      .subscribe(response => {
        response = response.filter(obj => obj.result === '_result');
        // this.multiRTC = [
        //   {
        //     label: 'RTC',
        //     data: unpackData('rtc', response).map(obj => obj.y),
        //   },
        // ];
        // this.labelRTC = unpackData('rtc', response).map(obj => obj.x);
        this.multiBatt = [
          {
            label: 'Battery',
            data: unpackData('battery', response).map(obj => obj.y),
          },
        ];
        this.labelBatt = unpackData('battery', response).map(obj => obj.x);
        this.multiTemp = [
          {
            label: 'Temperature',
            data: unpackData('temperature', response).map(obj => obj.y),
          },
        ];
        this.labelTemp = unpackData('temperature', response).map(obj => obj.x);
        this.multiIp = [
          {
            label: 'Ip',
            data: unpackData('i_p', response).map(obj => obj.y),
          },
        ];
        this.labelIp = unpackData('i_p', response).map(obj => obj.x);
        this.multiVon = [
          {
            label: 'Von',
            data: unpackData('v_on', response).map(obj => obj.y),
          },
        ];
        this.labelVon = unpackData('v_on', response).map(obj => obj.x);
        this.multiVoff = [
          {
            label: 'Voff',
            data: unpackData('v_off', response).map(obj => obj.y),
          },
        ];
        this.labelVoff = unpackData('v_off', response).map(obj => obj.x);

        this.multiVshift = [
          {
            label: 'Vshift',
            data: unpackData('v_shift', response).map(obj => obj.y),
          },
        ];
        this.labelVshift = unpackData('v_shift', response).map(obj => obj.x);

        this.multiVna = [
          {
            label: 'Vna',
            data: unpackData('v_na', response).map(obj => obj.y),
          },
        ];
        this.labelVna = unpackData('v_na', response).map(obj => obj.x);
        this.charts.forEach(chart => {
          // console.log(chart)
          chart?.update();
        });
      });
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
}
