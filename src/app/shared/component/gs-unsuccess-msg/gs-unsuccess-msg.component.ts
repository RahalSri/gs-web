import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'gs-unsuccess-msg',
  templateUrl: './gs-unsuccess-msg.component.html',
  styleUrls: ['./gs-unsuccess-msg.component.css']
})
export class GSUnsuccessMsgComponent {
  @Input() title?: string;
  @Input() message?: string;
  @Input() styleClass: any = {};


  constructor() {}
}
