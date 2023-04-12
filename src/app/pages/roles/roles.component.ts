import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'ngx-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  permissions: any[] = [];

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    actions: { add: true, edit: true, delete: true },
    columns: {
      _id: { title: 'ID', editable: false, type: 'string' },
      name: { title: 'Name', type: 'string' },
      perms: {
        title: 'Permissions',
        editable: true,
        type: 'string',
        valuePrepareFunction: (cell, row) => {
          return cell.join('|');
        },
      },
    },
  };

  constructor(private apiService: RoleService, private toastrService: NbToastrService) {}

  ngOnInit() {
    this.apiService.getPermissions().subscribe(permissions => {
      this.permissions = permissions;
    });

    this.apiService.getAllRoles().subscribe(roles => {
      this.source.load(roles);
    });
  }

  onCreate(event: any) {
    const role = event.newData;
    role.perms = role.perms.split('|');
    console.log('WTF', event);
    this.apiService.createRole(event.newData).subscribe(
      response => {
        this.toastrService.success('Role created successfully', 'Success');
        event.confirm.resolve(response);
      },
      error => {
        this.toastrService.danger('Failed to create role', 'Error');
        event.confirm.reject();
      },
    );
  }

  onUpdate(event: any) {
    const role = event.newData;
    role.perms = role.perms.split('|');
    this.apiService.updateRole(event.newData).subscribe(
      response => {
        this.toastrService.success('Role updated successfully', 'Success');
        event.confirm.resolve(response);
        this.apiService.getAllRoles().subscribe(roles => {
          this.source.load(roles);
        });
      },
      error => {
        this.toastrService.danger('Failed to update role', 'Error');
        event.confirm.reject();
      },
    );
  }
}
