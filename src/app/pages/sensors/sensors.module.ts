import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbSelectModule,
  NbTimepickerModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SensorsComponent } from './sensors.component';
import { NgChartsModule } from 'ng2-charts';
import { NodeCardModule } from '../dashboard/node-card/node-card.module';
import { SensorsRoutingModule } from './sensors-routing.module';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbButtonModule,
    NbSelectModule,
    Ng2SmartTableModule,
    NodeCardModule,
    NgChartsModule,
    SensorsRoutingModule,
    NbInputModule,
    NbDatepickerModule.forRoot(),
    NbTimepickerModule.forRoot(),
  ],
  declarations: [SensorsComponent],
})
export class SensorsModule { }
