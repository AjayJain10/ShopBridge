import { Component, OnInit, AfterContentChecked, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonServiceService } from 'src/services/common-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterContentChecked, OnDestroy {

  loaderFlag: boolean = false;
  subscription: Subscription;

  constructor(private commonService: CommonServiceService, private cdr: ChangeDetectorRef) {
    this.subscription = this.commonService.loaderObservable.subscribe(loaderFlag => { // Subscribing to the loaderObservable to show the loader when performing Asynchronous call
      console.log(loaderFlag);
      this.loaderFlag = loaderFlag;
    });
  }

  ngAfterContentChecked() { // To avoid the ExpressionChangedAfterItHasBeenChecked error
    this.cdr.detectChanges();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
