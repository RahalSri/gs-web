import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'gs-search',
  templateUrl: './gs-search.component.html',
  styleUrls: ['./gs-search.component.css']
})
export class GsSearchComponent implements OnInit {
  @Output() performSearch = new EventEmitter<string>();

  formControl: FormControl = new FormControl();
  searchForm: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.searchForm = this.createForm();
  }

  createForm() {
    return this.formBuilder.group({
      viewSearch: ['']
    });
  }

  search() {
    this.performSearch.emit(this.searchForm!.get('viewSearch')!.value);
  }
}
