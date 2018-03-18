import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class InteractionService {

  private emitChangeSource = new Subject<any>();

  changeEmitted$ = this.emitChangeSource.asObservable();

  constructor() { }

  emitChange(data: any) {
    this.emitChangeSource.next(data);
  }

}
