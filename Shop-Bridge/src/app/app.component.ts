import { Component, OnInit, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { CommonServiceService } from 'src/services/common-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterContentChecked  {

  loaderFlag: boolean = false;

  constructor(private commonService: CommonServiceService, private cdr: ChangeDetectorRef) {
    this.commonService.loaderObservable.subscribe(loaderFlag => {
      console.log(loaderFlag);
      this.loaderFlag = loaderFlag;
    });
   }

   ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  ngOnInit() {
  }

}
