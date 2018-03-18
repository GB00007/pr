import { NgControl }    from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import {
  Input,
  OnInit,
  Directive,
  OnDestroy,
  ElementRef
} from '@angular/core';

@Directive({
  selector: '[appUnmask]'
})
export class UnmaskDirective implements OnInit, OnDestroy {
  @Input() appUnmask: string;

  private subscription: Subscription;

  constructor(private model: NgControl, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.subscription = this.model.control.valueChanges.subscribe((): void => {
      this.model.control.setValue(
        this.elementRef.nativeElement.value.replace(new RegExp(this.appUnmask), '').toLowerCase(),
        {emitEvent: false, emitModelToViewChange: false, emitViewToModelChange: false}
      );
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
