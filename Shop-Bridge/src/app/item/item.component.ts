import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { CommonServiceService } from 'src/services/common-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  itemsForm: FormGroup;
  submitBtnClicked: boolean = false;
  errorMsgFlag: boolean = false;
  selectedItemId: number = null;
  editMode: boolean = false;
  itemActionMsg: { status: string, message: string } = { status: '', message: '' };

  constructor(private fb: FormBuilder, private commonService: CommonServiceService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initializeForm();
    this.route.queryParams.subscribe(params => {
      this.selectedItemId = params['itemId'] || null;
      console.log('Id->', this.selectedItemId);
      if (this.selectedItemId !== null) {
        this.editMode = true;
        this.commonService.updateLoaderStatus(true);
        this.commonService.getItemById(this.selectedItemId).subscribe(data => {
          console.log(data);
          if (data && data.status === 'success') {
            this.itemsForm.patchValue({ name: data.data.employee_name, salary: data.data.employee_salary, age: data.data.employee_age });
            this.commonService.updateLoaderStatus(false);
          }
        }, error => {
          console.log('Failure', error);
          this.commonService.updateLoaderStatus(false);
        });
      }
    });
  }

  loadItemData() {
    this.commonService.updateLoaderStatus(true);
    this.commonService.getItemById(this.selectedItemId).subscribe(data => {
      console.log(data);
      if (data && data.status === 'success') {
        this.itemsForm.patchValue({ name: data.data.employee_name, salary: data.data.employee_salary, age: data.data.employee_age });
        this.commonService.updateLoaderStatus(false);
      }
    }, error => {
      console.log('Failure', error);
      this.commonService.updateLoaderStatus(false);
    });

  }

  initializeForm() {
    this.itemsForm = this.fb.group({
      name: ['', Validators.required],
      // itemDescription: [''],
      salary: [null, Validators.required],
      age: [null],
      // itemQtyAvailable: [null, Validators.required]
    });
  }

  onSubmit() {
    this.submitBtnClicked = true;
    if (this.itemsForm.valid) {
      this.commonService.updateLoaderStatus(true);
      let reqData: any = this.itemsForm.value;
      reqData.age = '' + reqData.age;
      reqData.salary = '' + reqData.salary;
      console.log('Data->', reqData);
      console.log('Data->', JSON.stringify(reqData));
      if (this.editMode) {
        this.commonService.updateItem(this.selectedItemId, JSON.stringify(reqData)).subscribe(data => {
          console.log('Success->', data);
          this.commonService.updateLoaderStatus(false);
          this.itemActionMsg.status = 'success';
          this.itemActionMsg.message = 'Successfully Updated the Item no: ' + this.selectedItemId + '.';
        }, error => {
          this.itemActionMsg.status = 'error';
          this.itemActionMsg.message = 'Error Updating item! Retry...';
          this.commonService.updateLoaderStatus(false);
          console.log('Failure->', this.itemActionMsg, error);
        });
        setTimeout(() => {
          this.itemActionMsg = { status: '', message: '' };
        }, 5000);
      } else {
        this.commonService.createItem(JSON.stringify(reqData)).subscribe(data => {
          console.log('Success->', data);
          this.commonService.updateLoaderStatus(false);
          this.itemActionMsg.status = 'success';
          this.itemActionMsg.message = 'Item created Successfully.';
        }, error => {
          this.itemActionMsg.status = 'error';
          this.itemActionMsg.message = 'Error Creating item! Retry...';
          this.commonService.updateLoaderStatus(false);
          console.log('Failure->', this.itemActionMsg, error);
        });
        setTimeout(() => {
          this.itemActionMsg = { status: '', message: '' };
        }, 5000);
      }

    } else {
      this.errorMsgFlag = true;
      setTimeout(() => {
        this.errorMsgFlag = false;
      }, 3000);
    }

  }

  onCancel() {
    if (this.editMode) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMsgFlag = false;
      this.submitBtnClicked = false;
      this.itemsForm.reset();
    }
  }

}
