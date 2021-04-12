import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonServiceService } from 'src/services/common-service.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.scss']
})
export class DashboardContentComponent implements OnInit, OnDestroy {

  noDataText: string = '';
  items: Array<any> = [];
  itemsToSearch: Array<any> = [];
  noResultsFlag: boolean = false;
  subscription: Subscription;
  deleteInfo: { selectedItemToDelete: number, status: string, message: string } = { selectedItemToDelete: null, status: '', message: '' };

  constructor(private commonService: CommonServiceService, private router: Router) { }

  ngOnInit() {
    this.getAllItems();
  }

  getAllItems() { // Fetch data from API: GET operation
    this.commonService.updateLoaderStatus(true); // 
    this.subscription = this.commonService.getAllItems().subscribe(data => {
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

  transposeItemsArray(data: any) { // Grouping 3 array items into one array entry to display items using bootstrap row and col format.
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

  onEditItem(itemId: number) { // Edit or Update the existing item by routing to the existing component
    this.router.navigate(['/item'], { queryParams: { itemId: itemId } });
  }

  onDeleteItem(itemId: number) { // Delete item from the database, Response will come but won't get update in DB due to dummy API: DELETE
    this.commonService.updateLoaderStatus(true);
    this.deleteInfo.selectedItemToDelete = itemId;
    this.subscription = this.commonService.deleteItem(itemId).subscribe(data => {
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

  onSearch(event) { // To search items incase of huge data available in the dashboard
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

  ngOnDestroy() { // Unsubscribing from observable
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
