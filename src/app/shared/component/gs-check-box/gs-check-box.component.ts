import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'gs-check-box',
  template: './gs-check-box.component.html',
  styles: ['./gs-check-box.component.css']
})
export class GSCheckBoxComponent {
  @Input() label?: string;
  @Input() inputModel?: boolean;
  @Output() inputModelChange = new EventEmitter<any>();
  @Input() labelAfter?: false;
  @Input() styleClass?: string;

  constructor() {}

  selectionChanged(): void {
    this.inputModelChange.emit(this.inputModel);
  }
}
