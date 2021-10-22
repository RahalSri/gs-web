import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {

  @Input() isExpanded: Boolean = true;

  @Output() leftPanelOpened = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  onLeftPanelExpand(){
    this.leftPanelOpened.emit(true);
  }

}
