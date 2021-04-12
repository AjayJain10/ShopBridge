import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonServiceService } from 'src/services/common-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

itemsCount: number;
subscription: Subscription;

  constructor(private commonService: CommonServiceService) { }

  ngOnInit() {
    this.subscription = this.commonService.itemCountObservable.subscribe(itemsCount => { // Displaying items count available on the screen
      this.itemsCount = itemsCount;
    });
  }

  ngOnDestroy() { // Unsubscribing from observable
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }



}
