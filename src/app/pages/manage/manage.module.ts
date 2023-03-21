import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from '../manage/manage.component';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageRoutingModule } from './monage-routing.module';
import { NodeService } from '../../services/node.service';

@NgModule({
  declarations: [ManageComponent],
  imports: [
    ManageRoutingModule,
    CommonModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],

  providers: [NodeService],
})
export class ManageModule {}
