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
  templateUrl: './gs-button.component.html',
  styleUrls: ['./gs-button.component.css']
})
export class GSButtonComponent {
  @Input() label?: string;
  @Input() loading?: boolean = false;
  @Input() type?: string;
  @Input() disabled = false;
  @Input() color?: string = '';
  @Output() onClickEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() styleClass?: string;
  @Input() icon?: string;


  @ContentChild('iconRef') actionRef?: TemplateRef<any>;

  constructor() { }
}
