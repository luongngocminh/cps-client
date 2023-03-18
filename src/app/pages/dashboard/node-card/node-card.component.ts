import { delay } from 'rxjs/operators';
import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { INode } from '../../../interfaces/node.type';

declare const echarts: any;

@Component({
  selector: 'ngx-node-card',
  styleUrls: ['./node-card.component.scss'],
  template: `
    <nb-card size="tiny" class="solar-card">
      <nb-card-body>
        <div echarts [options]="option" class="echart" *ngIf="node.type === 0"></div>
        <div class="info">
          <div class="title h6">Node ID: {{ node?.nid }}</div>
          <div class="paragraph-2" *ngIf="node.type === 0">Battery: {{ node?.battery }}</div>
          <div class="paragraph-2" *ngIf="node.parent !== null || node.parent !== undefined">
            Parent Station ID: {{ node?.parent }}
          </div>
          <div class="paragraph-2">RTC: {{ node?.rtc }}</div>
          <div class="paragraph-2">Temperature: {{ node?.temperature }}</div>
          <div class="icon-container" [ngSwitch]="node?.status">
            <span class="paragraph-2">status: </span>
            <nb-icon *ngSwitchCase="0" icon="checkmark-circle-2-outline" status="success"></nb-icon>
            <nb-icon *ngSwitchCase="1" icon="close-circle-outline" status="danger"></nb-icon>
            <nb-icon *ngSwitchCase="2" icon="minus-circle-outline" status="warning"></nb-icon>
          </div>
        </div>
      </nb-card-body>
    </nb-card>
  `,
})
export class NodeCardComponent implements AfterViewInit, OnDestroy {
  private value = 0;
  private _node: INode;
  @Input()
  set node(node: INode) {
    this.chartValue = node.battery;
    this._node = node;
  }
  get node() {
    return this._node;
  }

  @Input()
  set chartValue(value: number) {
    this.value = value;

    const tmp = { ...this.option };
    if (tmp.series) {
      tmp.series[0].data[0].value = value;
      tmp.series[0].data[1].value = 100 - value;
      tmp.series[1].data[0].value = value;
    }
    this.option = { ...tmp };
  }

  option: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService) { }

  ngAfterViewInit() {
    this.themeSubscription = this.theme
      .getJsTheme()
      .pipe(delay(1))
      .subscribe(config => {
        const solarTheme: any = config.variables.solar;

        this.option = Object.assign(
          {},
          {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)',
            },
            series: [
              {
                name: ' ',
                clockWise: true,
                hoverAnimation: false,
                type: 'pie',
                center: ['45%', '50%'],
                radius: solarTheme.radius,
                data: [
                  {
                    value: this.value,
                    name: ' ',
                    label: {
                      normal: {
                        position: 'center',
                        formatter: '{d}%',
                        textStyle: {
                          fontSize: '18',
                          fontFamily: config.variables.fontSecondary,
                          fontWeight: '600',
                          color: config.variables.fgHeading,
                        },
                      },
                    },
                    tooltip: {
                      show: false,
                    },
                    itemStyle: {
                      normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          {
                            offset: 0,
                            color: solarTheme.gradientLeft,
                          },
                          {
                            offset: 1,
                            color: solarTheme.gradientRight,
                          },
                        ]),
                        shadowColor: solarTheme.shadowColor,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 3,
                      },
                    },
                    hoverAnimation: false,
                  },
                  {
                    value: 100 - this.value,
                    name: ' ',
                    tooltip: {
                      show: false,
                    },
                    label: {
                      normal: {
                        position: 'inner',
                      },
                    },
                    itemStyle: {
                      normal: {
                        color: solarTheme.secondSeriesFill,
                      },
                    },
                  },
                ],
              },
              {
                name: ' ',
                clockWise: true,
                hoverAnimation: false,
                type: 'pie',
                center: ['45%', '50%'],
                radius: solarTheme.radius,
                data: [
                  {
                    value: this.value,
                    name: ' ',
                    label: {
                      normal: {
                        position: 'inner',
                        show: false,
                      },
                    },
                    tooltip: {
                      show: false,
                    },
                    itemStyle: {
                      normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          {
                            offset: 0,
                            color: solarTheme.gradientLeft,
                          },
                          {
                            offset: 1,
                            color: solarTheme.gradientRight,
                          },
                        ]),
                        shadowColor: solarTheme.shadowColor,
                        shadowBlur: 7,
                      },
                    },
                    hoverAnimation: false,
                  },
                  {
                    value: 28,
                    name: ' ',
                    tooltip: {
                      show: false,
                    },
                    label: {
                      normal: {
                        position: 'inner',
                      },
                    },
                    itemStyle: {
                      normal: {
                        color: 'none',
                      },
                    },
                  },
                ],
              },
            ],
          },
        );
      });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
