import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { CommonServiceService } from 'src/services/common-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit, OnDestroy {

  itemsForm: FormGroup;
  submitBtnClicked: boolean = false;
  errorMsgFlag: boolean = false;
  selectedItemId: number = null;
  editMode: boolean = false;
  subscription: Subscription;
  itemActionMsg: { status: string, message: string } = { status: '', message: '' };

  constructor(private fb: FormBuilder, private commonService: CommonServiceService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initializeForm();

    this.subscription = this.route.queryParams.subscribe(params => { // Subscribing to queryParams to receive the itemId selected for update the item
      this.selectedItemId = params['itemId'] || null;
      console.log('Id->', this.selectedItemId);
      if (this.selectedItemId !== null) {
        this.editMode = true;
        this.commonService.updateLoaderStatus(true);
        this.subscription = this.commonService.getItemById(this.selectedItemId).subscribe(data => { // Fetch the single item by its ID from GET API call
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

  loadItemData() { // To load manually the selected item to UPDATE if API failed to load data on page load.
    this.commonService.updateLoaderStatus(true);
    this.subscription = this.commonService.getItemById(this.selectedItemId).subscribe(data => { // Fetch the single item by its ID from API: GET operation
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

  initializeForm() { // Initializing the empty form
    this.itemsForm = this.fb.group({
      name: ['', Validators.required],
      // itemDescription: [''],
      salary: [null, Validators.required],
      age: [null],
      // itemQtyAvailable: [null, Validators.required]
    });
  }

  onSubmit() { // Call to action for CREATE and UPDATE item
    this.submitBtnClicked = true;
    if (this.itemsForm.valid) {
      this.commonService.updateLoaderStatus(true);
      let reqData: any = this.itemsForm.value;
      reqData.age = '' + reqData.age;
      reqData.salary = '' + reqData.salary;
      console.log('Data->', JSON.stringify(reqData));
      if (this.editMode) {
        this.subscription = this.commonService.updateItem(this.selectedItemId, JSON.stringify(reqData)).subscribe(data => { // Update item by itemId using API: PUT operation
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
        this.subscription = this.commonService.createItem(JSON.stringify(reqData)).subscribe(data => { // Creating an item using API: POST operation
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

  onCancel() { // Call to action for cancel updating item and clearing the form
    if (this.editMode) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMsgFlag = false;
      this.submitBtnClicked = false;
      this.itemsForm.reset();
    }
  }

  ngOnDestroy() { // Unsubscribing from observable
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
