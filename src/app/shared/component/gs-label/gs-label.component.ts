import { Component, Input } from '@angular/core';

@Component({
  selector: 'gs-label',
  template: './gs-label.component.html',
  styleUrls: ['./gs-label.component.css']
})
export class GSLabelComponent {
  @Input() label?: string;
  @Input() value?: string;
  @Input() labelClass?: string;
  @Input() valueClass?: string;

  constructor() {
    this.labelClass = 'col-sm-3';
    this.valueClass = 'col-sm-9';
  }
}
