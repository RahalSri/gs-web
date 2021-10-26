import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroupDirective,
  Validators
} from '@angular/forms';

@Component({
  selector: 'gs-text-area',
  templateUrl: './gs-text-area.component.html',
  styleUrls: ['./gs-text-area.component.css'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ]
})
export class GsTextAreaComponent {
  @Input() label: string = ""
  @Input() placeholder: string = ""
  required: boolean = false
  @Output() onChangeEvent: EventEmitter<any> = new EventEmitter<any>();

  formControl: FormControl = new FormControl();

  constructor(private parentFormGroupDirective: FormGroupDirective) {}

  @Input()
  set name(value: any) {
    this.formControl = this.parentFormGroupDirective.form.get(
      value
    ) as FormControl;
    this.required = this.formControl.validator === Validators.required;
  }
}
