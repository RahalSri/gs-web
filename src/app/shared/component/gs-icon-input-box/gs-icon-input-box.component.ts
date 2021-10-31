import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroupDirective,
  Validators
} from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'gs-icon-input-box',
  templateUrl: './gs-icon-input-box.component.html',
  styleUrls: ['./gs-icon-input-box.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ]
})
export class GSIconInputBoxComponent {
  @Input() label?: string;
  @Input() labelTopPosition?: boolean = false;
  @Input() placeholder?: string;
  @Input() type?: string;
  required?: boolean;
  @Output() onChangeEvent: EventEmitter<any> = new EventEmitter<any>();
  textChanged: Subject<string> = new Subject<string>();
  @Input() iconClass?: string;

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
    this.required = this.formControl.validator === Validators.required;
  }

  onTextChange(event: any): void {
    this.textChanged.next(this.formControl.value);
  }
}
