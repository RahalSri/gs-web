import { Component, Input } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroupDirective,
  Validators
} from '@angular/forms';

@Component({
  selector: 'gs-password-box',
  template: './gs-password-box.component.html',
  styleUrls: ['./gs-password-box.component.css'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ]
})
export class GSPasswordBoxComponent {
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() type?: string;
  required?: boolean;
  fieldTextType?: boolean;

  formControl!: FormControl;

  constructor(private parentFormGroupDirective: FormGroupDirective) {}

  changeTextType(): void {
    this.fieldTextType = !this.fieldTextType;
  }

  @Input()
  set name(value: string | (string | number)[]) {
    this.formControl = this.parentFormGroupDirective.form.get(
      value
    ) as FormControl;
    this.required = this.formControl.validator === Validators.required;
    this.formControl.markAsTouched();
  }
}
