import { Renderer2, Component, ElementRef, AfterContentInit } from '@angular/core';

import { UIRouter } from '@uirouter/angular';

@Component({
  selector:    `app-authentication`,
  styleUrls:   ['./authentication.component.scss'],
  templateUrl: './authentication.component.html'
})
export class AuthenticationComponent implements AfterContentInit {
  public inLogin: boolean;
  public stateService: any;
  public inRegister: boolean;
  public inForgetPassword: boolean;

  constructor(
    private router:   UIRouter,
    private renderer2: Renderer2,
    private element:  ElementRef
  ) {
    this.stateService = router.stateService;
  }

  ngAfterContentInit(): void {
    this.renderer2.addClass(this.element.nativeElement, 'auth');
  }
}
