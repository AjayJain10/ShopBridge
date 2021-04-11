import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() itemsCount: number = 0;
  @Input() title: string;
  @Output() syncEventEmitter = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  getAllItems() {
    this.syncEventEmitter.emit('sync');
  }

  createNewItem() {
    this.syncEventEmitter.emit('create');
  }

}
