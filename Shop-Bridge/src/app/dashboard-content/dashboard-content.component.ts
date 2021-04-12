import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonServiceService } from 'src/services/common-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.scss']
})
export class DashboardContentComponent implements OnInit {

  noDataText: string = '';
  items: Array<any> = [];
  itemsToSearch: Array<any> = [];
  noResultsFlag: boolean = false;
  deleteInfo: { selectedItemToDelete: number, status: string, message: string } = { selectedItemToDelete: null, status: '', message: '' };

  constructor(private commonService: CommonServiceService, private router: Router) { }

  ngOnInit() {
    this.getAllItems();
  }

  getAllItems() {
    this.commonService.updateLoaderStatus(true);
    this.commonService.getAllItems().subscribe(data => {
      console.log(data);
      if (data && data.status === 'success') {
        this.commonService.updateItemsCount(data.data.length);
        this.items = [];
        this.itemsToSearch = data.data;

        this.transposeItemsArray(data.data);

        console.log(this.items);
        this.commonService.updateLoaderStatus(false);
      }
    }, error => {
      this.commonService.updateLoaderStatus(false);
      console.log(error);
    });
  }

  transposeItemsArray(data: any) {
    let count: number = 0;
    let tempArray: Array<any> = [];
    data.forEach(item => {
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
  }

  onEditItem(itemId: number) {
    this.router.navigate(['/item'], { queryParams: { itemId: itemId } });
  }

  onDeleteItem(itemId: number) {
    this.commonService.updateLoaderStatus(true);
    this.deleteInfo.selectedItemToDelete = itemId;
    this.commonService.deleteItem(itemId).subscribe(data => {
      console.log('Success', data);
      this.deleteInfo.status = 'success';
      this.deleteInfo.message = '  Deleted Item no:' + this.deleteInfo.selectedItemToDelete + 'successfully!';
      this.commonService.updateLoaderStatus(false);
      setTimeout(() => {
        this.deleteInfo = { selectedItemToDelete: null, status: '', message: '' };
      }, 2000);
    }, error => {
      console.log('Error-', error);
      this.deleteInfo.status = 'error';
      this.deleteInfo.message = '  Failed to delete Item no: ' + this.deleteInfo.selectedItemToDelete + '! Retry.';
      this.commonService.updateLoaderStatus(false);
      setTimeout(() => {
        this.deleteInfo = { selectedItemToDelete: null, status: '', message: '' };
      }, 2000);
    });
  }

  onSearch(event) {
    console.log(this.itemsToSearch);
    if (this.itemsToSearch && this.itemsToSearch.length > 0) {
      const tempArray: Array<any> = this.itemsToSearch.filter(item => item.employee_name.toLocaleLowerCase().indexOf(event.target.value.toLocaleLowerCase()) > -1);
      tempArray.sort((a, b) => a.employee_name.toLocaleLowerCase().indexOf(event.target.value.toLocaleLowerCase()) - b.employee_name.toLocaleLowerCase().indexOf(event.target.value.toLocaleLowerCase()));
      console.log(tempArray);
      if (tempArray && tempArray.length > 0) {
        this.noResultsFlag = false;
      } else {
        this.noResultsFlag = true;
      }
      this.items = [];
      this.commonService.updateItemsCount(tempArray.length);
      this.transposeItemsArray(tempArray);
    }
  }

}
