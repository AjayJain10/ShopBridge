import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.scss']
})
export class DashboardContentComponent implements OnInit {

  @Input() items: any = [];
  @Output() itemActionEmitter = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  onDeleteItem(itemId: number) {
    this.itemActionEmitter.emit(itemId);
  }

}
