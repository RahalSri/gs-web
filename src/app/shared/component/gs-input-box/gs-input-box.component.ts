import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroupDirective,
  Validators
} from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'gs-input-box',
  template: './gs-input-box.component.html',
  styleUrls: ['./gs-input-box.component.css'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ]
})
export class GSInputBoxComponent {
  @Input() label?: string;
  @Input() labelTopPosition?: boolean = false;
  @Input() placeholder?: string;
  @Input() type?: string;
  required?: boolean;
  @Output() onChangeEvent: EventEmitter<any> = new EventEmitter<any>();
  textChanged: Subject<string> = new Subject<string>();

  formControl!: FormControl;

  constructor(private parentFormGroupDirective: FormGroupDirective) {
    this.textChanged.pipe(debounceTime(500)).subscribe((model) => {
      this.onChangeEvent.emit(model);
    });
  }

  @Input()
  set name(value: string | (string | number)[]) {
    this.formControl = this.parentFormGroupDirective.form.get(
      value
    ) as FormControl;
    this.required = this.hasRequired(this.formControl);
  }

  onTextChange() {
    this.textChanged.next(this.formControl.value);
  }

  hasRequired(abstractControl: AbstractControl) {
    if (abstractControl.validator) {
      const validator = abstractControl.validator({} as AbstractControl);
      if (validator && validator.required) {
        return true;
      }
    }
    return false;
  }
}
