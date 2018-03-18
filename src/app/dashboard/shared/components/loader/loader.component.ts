import { Component, Input } from '@angular/core';

@Component({
  selector:  'app-loader',
  styleUrls: ['./loader.component.scss'],
  template:  `
    <mat-spinner
      [ngStyle]="pos"
      [diameter]='diameter'
      [strokeWidth]='strokeWidth'
    >
    </mat-spinner>
  `
})
export class LoaderComponent {
  @Input() pos:          any;
  @Input() diameter?:    number;
  @Input() strokeWidth?: number;
  // <mat-spinner *ngIf="!diameter && !strokeWidth"></mat-spinner>
  // <mat-spinner *ngIf="diameter && !strokeWidth" [diameter]='diameter'></mat-spinner>
  // <mat-spinner *ngIf="strokeWidth && !diameter" [strokeWidth]='strokeWidth'></mat-spinner>
  // tslint:disable-next-line:max-line-length
  // <mat-spinner *ngIf="strokeWidth && diameter" [strokeWidth]='strokeWidth' [diameter]='diameter'></mat-spinner>
}
