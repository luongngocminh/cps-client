import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { IUser } from '../../interfaces/user.type';
import { RoleService } from '../../services/role.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'ngx-user',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  selectedUser: any;

  userSource: LocalDataSource = new LocalDataSource();
  emailSource: LocalDataSource = new LocalDataSource();
  roles: { name: string; title: string }[] = [];
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private toastrService: NbToastrService,
  ) {}

  emailSettings = {
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
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      email: { title: 'Email' },
      createdAt: { title: 'Created At' },
      createdBy: { title: 'Created By' },
    },
    actions: {
      add: true,
    },
  };

  userSettings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    actions: {
      columnTitle: 'Actions',
      add: false,
      edit: true,
      delete: true,
    },
    columns: {
      _id: {
        title: 'ID',
        type: 'string',
        editable: false,
      },
      name: {
        title: 'Name',
        type: 'string',
      },
      email: {
        title: 'Email',
        type: 'string',
      },
      role: {
        title: 'Role',
        type: 'html',
        editor: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: this.roles,
          },
        },
        valuePrepareFunction: (cell, row) => {
          const roleName = this.roles.find(role => role.name === cell)?.name;
          return roleName || cell;
        },
      },
      createdAt: {
        title: 'Created At',
        type: 'string',
        editable: false,
      },
    },
  };

  ngOnInit(): void {
    this.getUsers();
    this.getRoles();
    this.getWhitelistedEmails();
  }

  getUsers() {
    this.userService.getAllUsers().subscribe(response => {
      this.userSource.load(response.data);
    });
  }

  getRoles(): void {
    this.roleService.getAllRoles().subscribe(roles => {
      const rolesWithTitle = roles.map(role => ({ name: role.name, title: role.name }));
      this.roles = rolesWithTitle;
      this.userSettings.columns.role.editor.config.list = rolesWithTitle;
      this.userSettings = {
        ...this.userSettings,
        columns: {
          ...this.userSettings.columns,
          role: {
            ...this.userSettings.columns.role,
            editor: {
              ...this.userSettings.columns.role.editor,
              config: { ...this.userSettings.columns.role.editor.config, list: rolesWithTitle },
            },
          },
        },
      };
    });
  }

  getWhitelistedEmails() {
    this.userService.getWhitelistedEmails().subscribe(response => {
      this.emailSource.load(response.data);
    });
  }

  whitelistEmail(event: any) {
    const email = event.newData.email;
    this.userService.whitelistEmail(email).subscribe(
      () => {
        this.toastrService.success('Email added to whitelist', 'Success');
        event.confirm.resolve();
        this.getWhitelistedEmails();
      },
      error => {
        this.toastrService.danger(error.message, 'Error');
        event.confirm.reject();
      },
    );
  }

  updateUser(event: any) {
    this.userService.updateUser(event.newData).subscribe(
      () => {
        this.toastrService.success('User updated', 'Success');
        event.confirm.resolve();
        this.getUsers();
      },
      error => {
        this.toastrService.danger(error.message, 'Error');
        event.confirm.reject();
      },
    );
  }

  deleteUser(event: any) {
    const user = event.data as IUser;
    this.userService.deleteUser(user._id).subscribe(
      () => {
        this.toastrService.success('User deleted', 'Success');
        this.getUsers();
      },
      error => {
        this.toastrService.danger(error.message, 'Error');
      },
    );
  }
}
