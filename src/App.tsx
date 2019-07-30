import React from 'react';
import './App.css';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WebSocketSrv } from './services';
import { CommandsType } from './services/websocket.service';
import { getCommandsType, preparePlayingField } from './helpers';
import GameSelector from './components/game-selector/GameSelector';
import PlayingField from './components/playing-field/PlayingField';
import GameTimer from './components/game-timer/GameTimer';

export interface PlayingFieldValue {
  value: string;
  x: number;
  y: number;
}
interface Props {}
interface State {
    gameLevel: string;
    playingField: PlayingFieldValue[][];
    toggleTimer: boolean;
}

export default class App extends React.Component<Props, State> {
    state: State = {
        gameLevel: '1',
        playingField: [],
        toggleTimer: false,
    };
    private unsubscribe$: Subject<void> = new Subject();

    componentWillMount() {
        this.initialization();
        WebSocketSrv.message$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(event => {
                if (getCommandsType(event.data) === CommandsType.map) {
                    const map = preparePlayingField(event.data.slice(5, -1));
                    this.setState({
                      playingField: map,
                    });
                    if (event.data.includes('*')) {
                      this.setState({
                        toggleTimer: false,
                      });
                    }
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
      if (!this.state.toggleTimer) {
        this.setState({
          toggleTimer: true,
        });
      }
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
                <GameTimer toggle={this.state.toggleTimer} />
              </div>
              <div className="App__playingField">
                <PlayingField playingField={this.state.playingField} select={this.selectCell} />
              </div>
            </div>
        );
    }

}
