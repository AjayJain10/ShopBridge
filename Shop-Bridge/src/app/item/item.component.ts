import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  itemsForm: FormGroup;
  submitBtnClicked: boolean = false;
  errorMsgFlag: boolean = false;
  loaderFlag: boolean = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.itemsForm = this.fb.group({
      itemName: ['', Validators.required],
      itemDescription: [''],
      itemPrice: [null, Validators.required],
      itemDiscount: [null],
      itemQtyAvailable: [null, Validators.required]
    });
  }

  onSubmit() {
    this.submitBtnClicked = true;
    if (this.itemsForm.valid) {

    } else {
      this.errorMsgFlag = true;
      setTimeout(() => {
        this.errorMsgFlag = false;
      }, 3000);
    }
  }

  onClear() {
    this.itemsForm.reset();
  }
}
