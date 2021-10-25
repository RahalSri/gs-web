import { Component, Input } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroupDirective
} from '@angular/forms';

@Component({
  selector: 'gs-switch',
  template: require('./gs-switch.component.html'),
  styles: ['./gs-switch.component.css'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ]
})
export class GSSwitchComponent {
  @Input() label?: string;
  @Input() id: string;
  formControl: FormControl;

  constructor(private parentFormGroupDirective: FormGroupDirective) {}

  @Input()
  set name(value) {
    this.formControl = this.parentFormGroupDirective.form.get(
      value
    ) as FormControl;
  }
}
