import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroupDirective,
  Validators
} from '@angular/forms';

@Component({
  selector: 'gs-text-area',
  template: require('./gs-text-area.component.html'),
  styles: ['./gs-text-area.component.css'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ]
})
export class GsTextAreaComponent {
  @Input() label?: string;
  @Input() placeholder?: string;
  required: boolean;
  @Output() onChangeEvent: EventEmitter<any> = new EventEmitter<any>();

  formControl: FormControl;

  constructor(private parentFormGroupDirective: FormGroupDirective) {}

  @Input()
  set name(value) {
    this.formControl = this.parentFormGroupDirective.form.get(
      value
    ) as FormControl;
    this.required = this.formControl.validator === Validators.required;
  }
}
