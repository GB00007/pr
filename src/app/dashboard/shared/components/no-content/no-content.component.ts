import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-content',
  template: `
    <div fxLayoutAlign="center center">
      <span class="alert alert-warning" [class.middle-display]="label === 'noSelectedItems' ">
        {{ label | translate }}
      </span>
    </div>
  `,
    // <mat-content class="mat-padding no-content">
    // </mat-content>
  styleUrls: ['./no-content.component.scss']
})
export class NoContentComponent {
  @Input() label = '';
}

