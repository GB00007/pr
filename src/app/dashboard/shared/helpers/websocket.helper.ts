import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import websocketConnect    from 'rxjs-websockets';
import { QueueingSubject } from 'queueing-subject';

import { APIS } from 'Config';

@Injectable()
export class WebsocketHelper {
  public  messages:         Observable<string>;
  public  connectionStatus: Observable<number>;
  private url:              string                  = APIS.WEBSOCKET_URL;
  private inputStream:      QueueingSubject<string> = new QueueingSubject<string>();

  public connect(): void {
    if (this.messages) {
      return;
    }
    const { messages, connectionStatus } = websocketConnect(this.url, this.inputStream);
    this.messages         = messages.share();
    this.connectionStatus = connectionStatus;
  }

  public send(message: string): void {
    this.inputStream.next(message);
  }
}
