import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import * as saveAs from 'file-saver';
import { LocalDataSource } from 'ng2-smart-table';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'ngx-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss'],
})
export class QueryComponent implements OnInit {
  settings = {
    columns: {
      _time: {
        title: 'Time',
        type: 'Date',
      },
      _measurement: {
        title: 'Measurement',
        type: 'string',
      },
      _value: {
        title: 'Value',
        type: 'number',
      },
      nodeid: {
        title: 'Node ID',
        type: 'string',
      },
      ntype: {
        title: 'Node Type',
        type: 'string',
      },
    },
    actions: {
      export: true,
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      perPage: 50,
    },
  };
  source: LocalDataSource;
  form: FormGroup;

  constructor(private dataService: DataService, private toastrService: NbToastrService) {
    this.form = new FormGroup({
      start: new FormControl(),
      stop: new FormControl(),
      nids: new FormControl(),
      ntype: new FormControl(),
      measurements: new FormControl(),
    });
  }
  ngOnInit(): void {
    this.source = new LocalDataSource();
  }
  onSubmit(): void {
    const params = this.form.value;
    params.start = params.start.toISOString();
    params.stop = params.stop.toISOString();
    const q = {
      ...params,
      nids: params.nids.split(','),
      every: '2m',
    };
    this.dataService.queryNodeData(q).subscribe(
      data => {
        this.source.load(data);
      },
      error => {
        console.error(error);
        this.toastrService.danger('Failed to fetch data', 'Error');
      },
    );
  }

  exportCSV() {
    this.source.getAll().then(data => {
      if (data.length) {

        const replacer = (key, value) => (value === null ? '' : value);
        // specify how you want to handle null values here
        const header = Object.keys(data[0]);
        let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
        csv.unshift(header.join(','));
        csv = csv.join('\r\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        saveAs(blob, 'export.csv');
      }
    });
  }
}
