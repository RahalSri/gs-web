import {Directive, ElementRef, Input} from '@angular/core';
import {KeycloakService} from "keycloak-angular";

@Directive({
  selector: '[hasPermission]'
})
export class AuthPermissionDirective {

  constructor(private elementRef: ElementRef,
              private readonly keycloak: KeycloakService) {
  }

  @Input('hasPermission') set authorize(hasPermission: string) {

    let authorize: boolean = true;

    hasPermission.split(',').forEach(role => {
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
    this.elementRef.nativeElement.setAttribute('disabled', true);
    this.elementRef.nativeElement.setAttribute('title', 'NO_AUTHORITY');
  }

  public authorizeDivisionElement() {
    this.elementRef.nativeElement.style.pointerEvents = 'none';
    this.elementRef.nativeElement.style.opacity = '0.6';
    this.elementRef.nativeElement.setAttribute('title', 'NO_AUTHORITY');
  }

  public authorizeListElement() {
    this.elementRef.nativeElement.style.pointerEvents = 'none';
    this.elementRef.nativeElement.setAttribute('title', 'NO_AUTHORITY');
  }

  public authorizeULElement() {
    this.elementRef.nativeElement.style.pointerEvents = 'none';
    this.elementRef.nativeElement.setAttribute('title', 'NO_AUTHORITY');
  }

  public authorizeAElement() {
    this.elementRef.nativeElement.style.pointerEvents = 'none';
    this.elementRef.nativeElement.setAttribute('title', 'NO_AUTHORITY');
  }
}
