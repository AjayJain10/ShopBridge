import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from 'src/services/common-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Shop-Bridge';

  constructor(private commonService: CommonServiceService) {  }

  ngOnInit(): void {
    this.commonService.getAllItems().subscribe(data => {
      console.log(data);
    }, error => {
      console.log(error);
    });
  }

}
