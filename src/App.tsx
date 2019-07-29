import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WebSocketSrv } from './services';
import { CommandsType } from './services/websocket.service';
import { getCommandsType, preparePlayingField } from './helpers';

interface Props {}
interface State {
    playingField: string[][],
}

export default class App extends React.Component<Props, State> {
    state: State = {
        playingField: [],
    };
    private unsubscribe$: Subject<void> = new Subject();

    componentWillMount() {
        this.initialization();
        WebSocketSrv.message$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(event => {
                if (getCommandsType(event.data) === CommandsType.map) {
                    console.log(event);
                    const map = preparePlayingField(event.data.slice(5, -1));
                    console.log('Получены данные: ', map);
                }
            });
    }

    componentWillUnmount() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    private initialization(): void {
        WebSocketSrv.sendCommand(CommandsType.help);
        WebSocketSrv.sendCommand(CommandsType.new, '1');
        WebSocketSrv.sendCommand(CommandsType.map);
        WebSocketSrv.sendCommand(CommandsType.open, '0 0');
        WebSocketSrv.sendCommand(CommandsType.map);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                    Learn React
                    </a>
                </header>
            </div>
        );
    }

}
