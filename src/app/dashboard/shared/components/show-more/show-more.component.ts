import { Input, Output, Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-show-more',
  styleUrls: ['./show-more.component.scss'],
  template: `
    <div
      fxLayoutWrap
      fxLayout="row"
      class="center-block"
      fxLayoutAlign="space-around center"
    >
      <div fxFlex="25">
        <button
          type="button"
          color="primary"
          mat-raised-button
          class="my-0 mt-2"
          (click)="showMore()"
          aria-label="Show more"
        >
          {{label | translate}}
        </button>
      </div>
    </div>
  `
})
export class ShowMoreComponent {
  @Input()  label = 'Show more';
  @Output() getNextPage: EventEmitter<any> = new EventEmitter();

  private currentPage = 0;

  reset() {
    this.currentPage = 0;
  }

  showMore(): void {
    this.getNextPage.emit(++this.currentPage);
  }
}
