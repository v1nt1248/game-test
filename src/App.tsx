import React from 'react';
import './App.css';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StoreSrv, WebSocketSrv } from './services';
import { CommandsType } from './services/websocket.service';
import { getCommandsType, preparePlayingField } from './helpers';
import GameSelector from './components/game-selector/GameSelector';
// import PlayingField from './components/playing-field/PlayingField';
import PlayingFieldCanvas from './components/playing-field-canvas/PlayingFieldCanvas';
import GameTimer from './components/game-timer/GameTimer';
import { PlayingFieldCoords } from './typing';

interface Props {}
interface State {
    gameLevel: string;
    playingField: string[][];
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
        // WebSocketSrv.sendCommand(CommandsType.help);
        this.startNewGame();
        WebSocketSrv.message$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(event => {
                if (getCommandsType(event.data) === CommandsType.map) {
                    const map = preparePlayingField(event.data.slice(5, -1));
                    const mapWithNotes = StoreSrv.refreshGameMap(map);
                    console.log('Map: ', mapWithNotes);
                    this.setState({
                      playingField: mapWithNotes,
                    });
                    if (event.data.includes('*')) {
                      this.setState({
                        toggleTimer: false,
                      });
                    }
                }
            });

        StoreSrv.change$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(data => {
                const map = this.state.playingField;
                const flagCoordsArray = data.coords.split(':');
                const flagCoords = {
                    x: Number(flagCoordsArray[1]),
                    y: Number(flagCoordsArray[0]),
                };
                map[flagCoords.y][flagCoords.x] = data.value ? '💣' : '';
                this.setState({
                    playingField: map,
                });
            });
    }

    componentWillUnmount() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    private startNewGame = (): void => {
        StoreSrv.clearStore();
        WebSocketSrv.sendCommand(CommandsType.new, this.state.gameLevel);
        WebSocketSrv.sendCommand(CommandsType.map);
    }

    private onLevelChange = (level: string): void => {
        this.setState({
            gameLevel: level,
        });
        this.startNewGame();
    }

    private selectCell = (coords: PlayingFieldCoords): void => {
        if (!this.state.toggleTimer) {
            this.setState({
            toggleTimer: true,
            });
        }
        WebSocketSrv.sendCommand(CommandsType.open, `${coords.x} ${coords.y}`)
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
                {/* <PlayingField playingField={this.state.playingField} select={this.selectCell} /> */}
                { this.state.playingField && this.state.playingField.length &&
                  <PlayingFieldCanvas playingField={this.state.playingField} />
                }
              </div>
            </div>
        );
    }

}
