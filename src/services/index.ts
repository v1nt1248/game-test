import { WebSocketService } from './websocket.service';
import { Store } from './store.service';

export const WebSocketSrv = new WebSocketService();
export const StoreSrv = new Store();
export * from './icons.service';