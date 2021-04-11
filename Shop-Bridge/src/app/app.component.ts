import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from 'src/services/common-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  items: Array<any> = [];
  itemsCount: number = 0;
  loaderFlag: boolean = false;

  constructor(private commonService: CommonServiceService) { }

  ngOnInit() {
    // this.getAllItems();
  }

  getAllItems() {
    this.loaderFlag = true;
    this.commonService.getAllItems().subscribe(data => {
      console.log(data);
      if (data && data.status === 'success') {

        this.itemsCount = data.data.length;
      }
    }, error => {
      this.loaderFlag = false;
      console.log(error);
    });
  }

}
