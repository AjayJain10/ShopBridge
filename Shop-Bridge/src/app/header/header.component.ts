import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() items: any = [];
  @Input() title: string;
  @Output() syncEventEmitter = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  getAllItems() {
    this.syncEventEmitter.emit();
  }

}
