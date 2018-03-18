import { Injectable, TemplateRef } from '@angular/core';
import { Observable }              from 'rxjs/Observable';

import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';

@Injectable()
export class SnugDialogHelper {
  private dialogRef: MatDialogRef<any>[] = [];

  constructor(private dialog: MatDialog) { }

  open<T>(
    componentOrTempalteRef: ComponentType<T> | TemplateRef<T>,
    config?: MatDialogConfig
  ): number {
    this.dialogRef.push(this.dialog.open(
      componentOrTempalteRef,
      config
    ));
    return this.dialogRef.length - 1;
  }

  afterClosed(index: number): Observable<any> {
    return this.dialogRef[index].afterClosed();
  }
}
