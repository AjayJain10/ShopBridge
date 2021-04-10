import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from 'src/services/common-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  items: Array<any> = [];
  itemsCount: number = 0;
  constructor(private commonService: CommonServiceService) { }

  ngOnInit() {
    // this.commonService.getAllItems().subscribe(data => {
    //   console.log(data);
    // }, error => {
    //   console.log(error);
    // });
  }

  getAllItems() {
    this.commonService.getAllItems().subscribe(data => {
      console.log(data);
      if (data && data.status === 'success') {
        this.itemsCount = data.data.length;
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
        if(tempArray.length > 0 ) {
          this.items.push(tempArray);
        }
        console.log(this.items);
      }
    }, error => {
      console.log(error);
    });
  }

  onDeleteItem(itemId) {
    this.commonService.deleteItem(itemId).subscribe(data => {
      console.log('Success', data);
    }, error => {
      console.log('Error-', error);
    });
  }

}
