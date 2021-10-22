import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() isExpanded: Boolean = true;

  @Output() leftPanelClosed = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  onLeftPanelClose(): void {
    this.leftPanelClosed.emit(false);
  }
}
