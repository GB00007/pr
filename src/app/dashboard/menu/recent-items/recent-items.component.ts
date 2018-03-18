import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';

import {StorageHelper} from '../../../shared/helpers/storage.helper';
import { ItemService } from 'DashboardServices';
import { PageService } from 'src/app/shared/services/page.service';

@Component({
  selector: 'app-recent-items',
  templateUrl: './recent-items.component.html',
  styleUrls: ['./recent-items.component.scss']
})
export class RecentItemsComponent {

  public recentItems: any [];
  public page : any;
  public language_item: any;
  public isRecentListEmpty = false;

  constructor(
    private itemService: ItemService,
    private storage: StorageHelper,
    private pageServie: PageService,
  ) {
    this.laodData();
  }


  laodData () {
    const requests: Observable<any>[] = [
      this.itemService.getRecentItem(this.storage.getData('pageId')),
      this.pageServie.getPage(this.storage.getData('pageIdentifier')),
    ];
    Observable.forkJoin(requests).subscribe(
      (data: any) => {
        this.recentItems = data[0];
        if(!data[0].length) {
            this.isRecentListEmpty = true;
        }
        this.page = data[1],
        this.language_item = data[1].languages.language_item;
        },
      (error: any) => console.log('erreur')
    )
  }
}
