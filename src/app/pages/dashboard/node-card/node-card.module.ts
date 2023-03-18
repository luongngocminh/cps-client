import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';

import { NodeCardComponent } from './node-card.component';

@NgModule({
  imports: [CommonModule, NbCardModule, NbButtonModule, NbIconModule, NbButtonModule, NgxEchartsModule],
  declarations: [NodeCardComponent],
  exports: [NodeCardComponent],
})
export class NodeCardModule { }
