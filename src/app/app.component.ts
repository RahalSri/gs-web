import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLeftPanelExpanded = true;
  title = 'gs-web';

  onLeftPanelToggle(isExpanded: boolean){
    this.isLeftPanelExpanded = isExpanded;
  }
}
