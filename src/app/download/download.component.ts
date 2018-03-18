import { Component } from '@angular/core';

@Component({
  selector:    'app-download',
  templateUrl: './download.component.html',
  styleUrls:   ['./download.component.scss']
})
export class DownloadComponent {
  public packageName = 'com.snugmenu.snugstaff';

  constructor() {
    window.location.href = `https://play.google.com/store/apps/details?id=${this.packageName}`;
  }
}
