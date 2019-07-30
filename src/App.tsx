import React from 'react';
import './App.css';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WebSocketSrv } from './services';
import { CommandsType } from './services/websocket.service';
import { getCommandsType, preparePlayingField } from './helpers';
import GameSelector from './components/game-selector/GameSelector';
import PlayingField from './components/playing-field/PlayingField';

export interface PlayingFieldValue {
  value: string;
  x: number;
  y: number;
}
interface Props {}
interface State {
    gameLevel: string;
    playingField: PlayingFieldValue[][],
}

export default class App extends React.Component<Props, State> {
    state: State = {
        gameLevel: '1',
        playingField: [],
    };
    private unsubscribe$: Subject<void> = new Subject();

    componentWillMount() {
        this.initialization();
        WebSocketSrv.message$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(event => {
              // console.log(event);
                if (getCommandsType(event.data) === CommandsType.map) {
                    const map = preparePlayingField(event.data.slice(5, -1));
                    // console.log('Получены данные: ', map);
                    this.setState({
                      playingField: map,
                    });
                }
            });
    }

    componentWillUnmount() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    private initialization(): void {
        // WebSocketSrv.sendCommand(CommandsType.help);
        WebSocketSrv.sendCommand(CommandsType.new, this.state.gameLevel);
        WebSocketSrv.sendCommand(CommandsType.map);
    }

    private startNewGame = (): void => {
      WebSocketSrv.sendCommand(CommandsType.new, this.state.gameLevel);
      WebSocketSrv.sendCommand(CommandsType.map);
    }

    private onLevelChange = (level: string): void => {
      this.setState({
        gameLevel: level,
      });
      WebSocketSrv.sendCommand(CommandsType.new, level);
      WebSocketSrv.sendCommand(CommandsType.map);
    }

    private selectCell = (cell: PlayingFieldValue): void => {
      WebSocketSrv.sendCommand(CommandsType.open, `${cell.x} ${cell.y}`)
      WebSocketSrv.sendCommand(CommandsType.map);
    }

    render() {
        return (
            <div className="App">
              <div className="App__toolbar">
                <GameSelector level={this.state.gameLevel} levelChange={this.onLevelChange}/>
                <button type="button" className="App__btn" onClick={this.startNewGame}>
                  Начать заново
                </button>
              </div>
              <div className="App__playingField">
                <PlayingField playingField={this.state.playingField} select={this.selectCell} />
              </div>
            </div>
        );
    }

}
