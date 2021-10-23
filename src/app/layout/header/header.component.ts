import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() isExpanded: boolean = true;

  @Output() leftPanelClosed = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  onLeftPanelToggle(): void {
    this.isExpanded = !this.isExpanded;
    this.leftPanelClosed.emit(this.isExpanded);
  }
}
