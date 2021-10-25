import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'gs-select',
  template: './gs-select.component.html',
  styleUrls: ['./gs-select.component.css']
})
export class GSSelectComponent implements OnInit {
  @Input() label?: string;
  @Input() labelTopPosition?: boolean = false;
  @Input() key!: string;
  @Input() value?: string;
  @Input() placeholder?: string;
  @Input() disabled = false;
  @Output() onChangeEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSearchEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() list: any;
  @Input() selectedOptions: any;
  textChanged: Subject<string> = new Subject<string>();
  @Input() styleClass?: string;
  @Input() isFormGroup: boolean = true;

  required?: boolean;
  config = {};
  formControl!: FormControl;

  constructor(private parentFormGroupDirective: FormGroupDirective) {
    this.textChanged.pipe(debounceTime(500)).subscribe((model) => {
      this.onSearchEvent.emit(model);
    });
  }

  @Input()
  set name(value: string | (string | number)[]) {
    this.formControl = this.parentFormGroupDirective.form.get(
      value
    ) as FormControl;
    this.required = this.formControl.validator === Validators.required;
  }

  ngOnInit(): void {
    this.config = {
      displayFn: (item: any) => {
        return item[this.key];
      },
      displayKey: this.value,
      search: true,
      height: '200px',
      placeholder: this.placeholder,
      searchPlaceholder: 'Search',
      searchOnKey: this.key
    };
  }

  selectionChanged(event: any): void {
    this.onChangeEvent.emit(event);
  }

  onTextChange(event: any): void {
    // this.textChanged.next(this.formControl.value);
  }

  onSearched(event: any) {
    this.onSearchEvent.emit(event);
  }

  onDropDownClick() {
    this.formControl.markAsTouched();
  }
}
