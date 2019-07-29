import { Subject, Observable } from 'rxjs';

const baseUrl = 'wss://hometask.eg1236.com/game1/';

export enum CommandsType {
    help = 'help',
    new = 'new',
    map = 'map',
    open = 'open',
}

class Ws {
    private promise!: Promise<WebSocket>;

    public getWsClient(): Promise<WebSocket> {
        if (!this.promise) {
          this.promise = this.newClientPromise();
        }
        return this.promise;
    }

    private newClientPromise(): Promise<WebSocket> {
        return new Promise((resolve, reject) => {
            const wsClient = new WebSocket(baseUrl);
            wsClient.onopen = () => {
                console.info('Соединение установлено!');
                resolve(wsClient);
            };
            wsClient.onerror = error => reject(error);
        });
    }
}

const socket: Ws = new Ws();

export class WebSocketService {
    private message: Subject<MessageEvent> = new Subject();

    public get message$(): Observable<MessageEvent> {
        return this.message.asObservable();
    }

    public closeConnection(): void {
        socket.getWsClient()
            .then(ws => {
                ws.close(1000);
                console.info('Соединение закрыто чисто');
            })
            .catch(err => {
                console.error('Обрыв соединения');
            });
    }

    public sendCommand(type: CommandsType, params?: string | null): void {
        const fullCommand = params
            ? `${type} ${params}`
            : type;
        socket.getWsClient()
            .then(ws => {
                ws.send(fullCommand);
                ws.onmessage = (event: MessageEvent): void => {
                    this.message.next(event);
                }  
            })
    }
}
