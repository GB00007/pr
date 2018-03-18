import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { ItemsHelper }            from './items.helper';
import { PrintHelper }            from './print.helper';
import { ConvertorHelper }        from './convertor.helper';
import { WebsocketHelper }        from './websocket.helper';
import { SnugDialogHelper }       from './snug-dialog.helper';
import { PermissionsHelper }      from './permissions.helper';
import { SignatureManagerHelper } from './signature-manager.helper';
import { FormattersModule }       from './formatters/formatters.module';

@NgModule({
  imports:   [
    CommonModule,
    TranslateModule,
    FormattersModule
  ],
  providers: [
    ItemsHelper,
    PrintHelper,
    ConvertorHelper,
    WebsocketHelper,
    SnugDialogHelper,
    PermissionsHelper,
    SignatureManagerHelper
  ]
})
export class HelpersModule {}
export {
  ItemsHelper,
  PrintHelper,
  ConvertorHelper,
  WebsocketHelper,
  SnugDialogHelper,
  PermissionsHelper,
  SignatureManagerHelper
};
