import { Component, Input, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/core/service/app-config.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  copyrightNotice: string = "";

  constructor(private appConfigService: AppConfigService) { }

  ngOnInit(): void {
    this.appConfigService.appConfig.subscribe(config =>{
      this.copyrightNotice = config.copyrightNotice!;
    });
  }
}
