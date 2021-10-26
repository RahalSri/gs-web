import {Directive, ElementRef, Input} from '@angular/core';
import {KeycloakService} from "keycloak-angular";

@Directive({
  selector: '[hasPermissionHide]'
})
export class AuthUiHidePermissionDirective {

  constructor(private elementRef: ElementRef,
              private readonly keycloak: KeycloakService) {
  }

  @Input('hasPermissionHide') set authorize(hasPermissionHide: string) {

    let authorize: boolean = true;

    hasPermissionHide.split(',').forEach(role => {
      authorize = this.keycloak.isUserInRole(role.trim());
    });

    if (!authorize) {
      switch (this.elementRef.nativeElement.tagName) {
        case 'BUTTON':
          this.authorizeButtonElement();
          break;
        case 'DIV':
          this.authorizeDivisionElement();
          break;
        case 'LI':
          this.authorizeListElement();
          break;
        case 'UL':
          this.authorizeULElement();
          break;
        case 'A':
          this.authorizeAElement();
          break;
        default:
          console.log('Default Executed: Element Tag Name is Not Defined!');
      }
    }
  }

  public authorizeButtonElement() {
    this.elementRef.nativeElement.style.display = 'none';
  }

  public authorizeDivisionElement() {
    this.elementRef.nativeElement.style.display = 'none';
  }

  public authorizeListElement() {
    this.elementRef.nativeElement.style.display = 'none';
  }

  public authorizeULElement() {
    this.elementRef.nativeElement.style.display = 'none';
  }

  public authorizeAElement() {
    this.elementRef.nativeElement.style.display = 'none';
  }
}
