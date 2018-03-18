import { Component, Input } from '@angular/core';

@Component({
  selector:    'app-snug-discount-label',
  templateUrl: './snug-discount-label.component.html',
  styleUrls:   ['./snug-discount-label.component.scss']
})
export class SnugDiscountLabelComponent {
  @Input() discount: number;
}
