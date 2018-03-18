import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-export',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.scss']
})
export class AccountingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  tabChanged(event: any): void {
    // console.log(event);
  }
}
