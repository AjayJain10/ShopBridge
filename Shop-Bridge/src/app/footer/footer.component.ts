import { Component, OnInit, Input } from '@angular/core';
import { CommonServiceService } from 'src/services/common-service.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

itemsCount: number;

  constructor(private commonService: CommonServiceService) { }

  ngOnInit() {
    this.commonService.itemCountObservable.subscribe(itemsCount => {
      this.itemsCount = itemsCount;
    });
  }

}
