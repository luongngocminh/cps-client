import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbIconModule, NbSelectModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NodeCardModule } from './node-card/node-card.module';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbButtonModule,
    Ng2SmartTableModule,
    NodeCardModule,
    NbSelectModule,
  ],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
