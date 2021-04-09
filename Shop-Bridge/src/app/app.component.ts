import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from 'src/services/common-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Shop-Bridge';
  items: Array<any> = [];

  constructor(private commonService: CommonServiceService) {  }

  ngOnInit(): void {
    // this.commonService.getAllItems().subscribe(data => {
    //   console.log(data);
    // }, error => {
    //   console.log(error);
    // });
  }

  getAllItems() {
    this.commonService.getAllItems().subscribe(data => {
      console.log(data);
      if(data && data.status === 'success') {
        this.items = [];
        let tempArray = [];
        data.data.forEach((item, index) => {
          if(index === 0 || index % 3 !== 0) {
            tempArray.push(item);
          } else {
            this.items.push(tempArray);
            tempArray = [item];
          }
        });
        this.items.push(tempArray);
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
