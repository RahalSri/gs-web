import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'gs-unsuccess-msg',
  template: require('./gs-unsuccess-msg.component.html'),
  styles: ['./gs-unsuccess-msg.component.css']
})
export class GSUnsuccessMsgComponent {
  @Input() title: string;
  @Input() message: string;
  @Input() styleClass: any = {};


  constructor() {}
}
