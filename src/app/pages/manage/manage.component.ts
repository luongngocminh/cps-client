import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NodeService } from '../../services/node.service';

@Component({
  selector: 'ngx-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
})
export class ManageComponent implements OnInit {
  configForm: FormGroup;
  constructor(
    private router: Router,
    private nodeService: NodeService,
    private fb: FormBuilder,
    private toastrService: NbToastrService,
  ) {}

  ngOnInit(): void {
    this.configForm = this.fb.group({
      windowTimers: [1000, Validators.required],
      sessionTimeout: [4000, Validators.required],
      nodeTimeout: [3600000, Validators.required],
    });
  }

  saveConfig() {
    if (this.configForm.valid) {
      // TODO: implement save logic using the configForm values
      this.toastrService.success('Config saved successfully!', 'Success');
    } else {
      this.toastrService.warning('Please fill all the required fields', 'Warning');
    }
  }

  resyncAllNodes() {
    // TODO: implement resync logic
    this.toastrService.success('All nodes resynced!', 'Success');
  }

  triggerCalibration() {
    // TODO: implement calibration logic
    this.nodeService.broadcastTriggerCalibration().subscribe(res => {
      this.toastrService.warning('Calibration triggered!', 'Warning');
      this.router.navigate(['/pages/dashboard']);
    });
  }
}
