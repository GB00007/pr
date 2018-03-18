import { NgModule }            from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule }        from '@angular/common';
import { BrowserModule }       from '@angular/platform-browser';

import { UIRouterModule }                  from '@uirouter/angular';
import { MatInputModule, MatButtonModule } from '@angular/material';
import { TranslateModule }                 from '@ngx-translate/core';
import { NgbModule }                       from '@ng-bootstrap/ng-bootstrap';

import { ComponentsModule } from 'AppComponents';
import { LoginComponent }   from './login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    NgbModule,
    HttpClientModule,
    CommonModule,
    BrowserModule,
    MatInputModule,
    MatButtonModule,
    UIRouterModule,
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule
  ]
})
export class LoginModule {}
