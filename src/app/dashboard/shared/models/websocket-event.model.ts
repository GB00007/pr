import { Order, AddItemToOrderResponse } from './order.model';

export type WebsocketEventData = Order | AddItemToOrderResponse;

export interface WebsocketEvent {
  event_type: string;
  data:       WebsocketEventData;
}
