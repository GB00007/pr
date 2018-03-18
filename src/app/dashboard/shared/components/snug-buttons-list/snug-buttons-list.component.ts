import { PageService } from 'AppServices';
import { CurrencyPipe } from '@angular/common';
import {
  Input,
  Output,
  Component,
  EventEmitter,
  Inject,
  ElementRef,
  Renderer2,
  AfterViewInit,
  OnInit,
  AfterContentChecked
} from '@angular/core';
import {
  MAX_ITEMS_PAGE_SIZE,
} from 'Config';
import { StorageHelper } from 'src/app/shared/helpers/helpers.module';
@Component({
  selector:    'app-snug-buttons-list',
  templateUrl: './snug-buttons-list.component.html',
  styleUrls:   ['./snug-buttons-list.component.scss']
})
export class SnugButtonsListComponent implements OnInit {


  @Input()  isLastPage: any;
  @Input()  currentPage: any;
  @Input()  composedItems: any[];
  @Input()  items:                      any[];
  @Input()  label:                      string;
  @Input()  menuOfDay:                  boolean;
  @Input()  noContent:                  string;
  @Input()  selectedId?:                string;
  @Input()  isInernalCategoriesActive?: string;
  @Input()  isLoadItems?:               boolean;
  @Output() onButtonClick:              EventEmitter<any> = new EventEmitter();
  @Input() isRecentEmptyy: any;
  public  languages: any;
  private height:                       string;
  private max = MAX_ITEMS_PAGE_SIZE;

  constructor(
    private renderer: Renderer2,
    @Inject('Window') private window: Window,
    private pageService: PageService,
    private storage: StorageHelper ) {
      this.getPageInfo();
  }

  getPageInfo(): void {
    this.pageService.getUserPage().subscribe(
      (data: any) => {
        this.languages = data.languages.language_item;
      }
    )
  }
  ngOnInit(): void {
    this.height = (this.window.screen.height).toString();

  }
}
