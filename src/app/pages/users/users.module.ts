import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from '../users/users.component';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbSelectModule, NbTabsetModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { UsersRoutingModule } from './users-routing.module';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbSelectModule,
    Ng2SmartTableModule,
    UsersRoutingModule,
    NbTabsetModule,
    NbInputModule,
  ],
  providers: [UserService, RoleService],
})
export class UsersModule { }
