import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonServiceService } from 'src/services/common-service.service';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.scss']
})
export class DashboardContentComponent implements OnInit {

  // @Input() items: any = [];
  noDataText: string = '';
  // @Output() itemActionEmitter = new EventEmitter<number>();
  items: Array<any> = [];
  loaderFlag: boolean = false;
  deleteInfo: {selectedItemToDelete: number, status: string, message: string} = {selectedItemToDelete: null, status: '', message: ''};

  constructor(private commonService: CommonServiceService) { }

  ngOnInit() {
    this.getAllItems();
  }

  // onDeleteItem(itemId: number) {
  //   this.itemActionEmitter.emit(itemId);
  // }

  // headerActions(action: string) {
  //   if (action === 'sync') {
  //     this.getAllItems();
  //   } else if (action === 'create') {
  //     this.createNewItem();
  //   }
  // }

  getAllItems() {
    this.loaderFlag = true;
    this.commonService.getAllItems().subscribe(data => {
      console.log(data);
      if (data && data.status === 'success') {
        this.items = [];
        let count: number = 0;
        let tempArray: Array<any> = [];

        data.data.forEach(item => {
          count++;
          if (count !== 4) {
            tempArray.push(item);
          } else {
            this.items.push(tempArray);
            tempArray = [item];
            count = 1;
          }
        });
        if (tempArray.length > 0) {
          this.items.push(tempArray);
        }
        console.log(this.items);
        this.loaderFlag = false;
      }
    }, error => {
      this.loaderFlag = false;
      console.log(error);
    });
  }

  // createNewItem() {
  //   this.items = [];
  //   // this.loaderFlag = true;
  // }

  onDeleteItem(itemId: number) {
    this.loaderFlag = true;
    this.deleteInfo.selectedItemToDelete = itemId;
    this.commonService.deleteItem(itemId).subscribe(data => {
      console.log('Success', data);
      this.deleteInfo.status = 'success';
      this.deleteInfo.message = 'Deleted Item no:' + this.deleteInfo.selectedItemToDelete + 'successfully!';
      this.loaderFlag = false;
      setTimeout(() => {
        this.deleteInfo = {selectedItemToDelete: null, status: '', message: ''};
      }, 2000);
    }, error => {
      console.log('Error-', error);
      this.deleteInfo.status = 'error';
      this.deleteInfo.message = 'Failed to delete Item no: ' + this.deleteInfo.selectedItemToDelete + '!';
      this.loaderFlag = false;
      setTimeout(() => {
        this.deleteInfo = {selectedItemToDelete: null, status: '', message: ''};
      }, 2000);
    });
  }

}
