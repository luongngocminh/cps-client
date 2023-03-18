import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { RolesComponent } from './roles.component';
import { RolesRoutingModule } from './roles-routing.module';
import { RoleService } from '../../services/role.service';

@NgModule({
  declarations: [RolesComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbSelectModule,
    Ng2SmartTableModule,
    NbInputModule,
    RolesRoutingModule,
  ],
  providers: [RoleService],
})
export class RolesModule { }
