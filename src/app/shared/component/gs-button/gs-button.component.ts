import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef
} from '@angular/core';

@Component({
  selector: 'gs-button',
  template: './gs-button.component.html',
  styles: ['./gs-button.component.css']
})
export class GSButtonComponent {
  @Input() label?: string;
  @Input() loading?: boolean;
  @Input() type?: string;
  @Input() disabled = false;
  @Output() onClickEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() styleClass?: string;
  @Input() icon?: string;

  @ContentChild('iconRef') actionRef?: TemplateRef<any>;

  constructor() {}
}
