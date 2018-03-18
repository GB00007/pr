import { NgModule } from '@angular/core';

import { Ng2UiAuthModule }                                 from 'ng2-ui-auth';
import { UIRouterModule }                                  from '@uirouter/angular';
import { MatIconModule, MatButtonModule }                  from '@angular/material';
import { NgbModule, NgbDropdownModule, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

import { Ng2UiAuthConfig }             from 'Config';
import { HelpersModule }               from 'AppHelpers';
import { ComponentsModule }            from 'AppComponents';
import { LoginModule }                 from './login/login.module';
import { AuthenticationComponent }     from './authentication.component';
import { RegisterModule }              from './register/register.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { ForgetPasswordModule }        from './forget-password/forget-password.module';

@NgModule({
  exports: [HelpersModule, MatIconModule, MatButtonModule],
  providers:    [NgbDropdownConfig],
  declarations: [AuthenticationComponent],
  imports:      [
    NgbModule,
    LoginModule,
    MatIconModule,
    HelpersModule,
    MatButtonModule,
    UIRouterModule,
    RegisterModule,
    ComponentsModule,
    NgbDropdownModule,
    ForgetPasswordModule,
    AuthenticationRoutingModule,
    Ng2UiAuthModule.forRoot(Ng2UiAuthConfig)
  ]
})
export class AuthenticationModule {}
