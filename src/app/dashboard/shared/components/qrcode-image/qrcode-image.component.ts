import { PageService } from 'AppServices';
import { Input, OnInit, Component, ElementRef } from '@angular/core';

import { forEach } from 'lodash';
import * as QRCode from 'qrcodejs2';

@Component({
  template: '',
  selector:  'app-qrcode-image',
  styleUrls: ['./qrcode-image.component.scss']
})
export class QrcodeImageComponent implements OnInit {
  @Input() color;
  @Input() qrdata = '';
  @Input() width  = 215;
  @Input() height = 215;

  private qr: any;
  private page: any;
  private colorLight = '#FFFFFF';

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    try {
      if (this.qrdata === '') {
        throw new Error('Empty QR Code data');
      }
      // this.loadPageData();
      this.updateQrcode();
    } catch (e) {
      console.log(e);
    }
  }

  updateQrcode(newQrcode?, colorDark?) {
    this.color = (this.color === 'undefined') ? undefined : this.color;
    forEach(['img', 'canvas'], (target: string): void => {
      if (this.el.nativeElement.querySelector(target)) {
        this.el.nativeElement.querySelector(target).remove();
      }
    });
    this.qr = new QRCode(this.el.nativeElement, {
      width:        this.width,
      height:       this.height,
      colorLight:   this.colorLight,
      correctLevel: QRCode.CorrectLevel.H,
      text:         newQrcode || this.qrdata,
      colorDark:     this.color
    });
  }
}
