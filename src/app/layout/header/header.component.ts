import { Component, EventEmitter, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() leftPanelOpened = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  onLeftPanelToggle(): void {
    this.leftPanelOpened.emit();
  }
}
