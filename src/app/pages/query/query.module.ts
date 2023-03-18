import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryComponent } from '../query/query.component';
import { NbButtonModule, NbCardModule, NbDatepickerModule, NbInputModule, NbSelectModule, NbTimepickerModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DataService } from '../../services/data.service';
import { QueryRoutingModule } from './query-routing.module';

@NgModule({
  declarations: [QueryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbSelectModule,
    Ng2SmartTableModule,
    QueryRoutingModule,
    NbDatepickerModule.forRoot(),
    NbTimepickerModule.forRoot(),
  ],
  providers: [DataService],
})
export class QueryModule {}
