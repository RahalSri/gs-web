import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'gs-check-box',
  templateUrl: './gs-check-box.component.html',
  styleUrls: ['./gs-check-box.component.css']
})
export class GSCheckBoxComponent {
  @Input() label?: string;
  @Input() inputModel?: boolean;
  @Output() inputModelChange = new EventEmitter<any>();
  @Input() labelAfter?: false;
  @Input() styleClass = "";

  constructor() {}

  selectionChanged(): void {
    this.inputModelChange.emit(this.inputModel);
  }
}
