const baseUrl = 'wss://hometask.eg1236.com/game1/';

export enum GameCommands {
    help = 'help',
    new = 'new',
    map = 'map',
    open = 'open',
}

class Ws {
    private promise!: Promise<WebSocket>;

    public clientPromise(): Promise<WebSocket> {
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
    public closeConnection(): void {
        socket.clientPromise()
            .then(ws => {
                ws.close(1000);
                console.info('Соединение закрыто чисто');
            })
            .catch(err => {
                console.error('Обрыв соединения');
            });
    }

    public sendCommand(command: GameCommands, options?: any): void {
        const fullCommand = options
            ? `${command} ${options}`
            : command;
        socket.clientPromise()
            .then(ws => {
                ws.send(fullCommand);
                ws.onmessage = (event: MessageEvent): void => {
                    this.showMessageData(event);
                }
            })
    }

    private showMessageData(event: MessageEvent): void {
        console.log('M: ', event);
        console.log('Получены данные: ', event.data);
    }
}