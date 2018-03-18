import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }                    from '@angular/platform-browser';

import { UIRouterModule }   from '@uirouter/angular';
import { MatButtonModule }  from '@angular/material';
import { TranslateModule }  from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ServicesModule }                             from 'DashboardServices';
import { ComponentsModule }                           from 'DashboardComponents';
import { SocialsComponent }                           from './socials.component';
import { ComponentsModule as SocialComponentsModule } from './shared/components/components.module';
@NgModule({
  declarations: [SocialsComponent],
  imports:      [
    FormsModule,
    BrowserModule,
    ServicesModule,
    UIRouterModule,
    MatButtonModule,
    TranslateModule,
    SocialComponentsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    ComponentsModule
    // LoaderComponent
  ]
})
export class SocialsModule {}
