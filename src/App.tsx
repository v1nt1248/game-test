import React, { RefObject } from 'react';
import './App.css';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WebSocketSrv } from './services';
import { CommandsType } from './services/websocket.service';
import { getCommandsType, getPlayingFieldChanges, getPlayingFieldSize } from './helpers';
import GameSelector from './components/game-selector/GameSelector';
import PlayingFieldCanvas from './components/playing-field-canvas/PlayingFieldCanvas';
import GameTimer from './components/game-timer/GameTimer';
import { PlayingFieldCoords, PlayingFieldValue } from './typing';

interface Props {}
interface State {
    gameLevel: string;
    playingFieldSize: {width: number; height: number} | null;
    playingFieldChanges: PlayingFieldValue[] | null;
    toggleTimer: boolean;
}

export default class App extends React.Component<Props, State> {
    state: State = {
        gameLevel: '1',
        playingFieldSize: null,
        playingFieldChanges: null,
        toggleTimer: false,
    };
    private playingFieldWrapperRef!: RefObject<HTMLDivElement>;
    private playingFieldAsString: string = '';
    private unsubscribe$: Subject<void> = new Subject();

    constructor(props: Props) {
        super(props);
        this.playingFieldWrapperRef = React.createRef();
    }

    componentWillMount(): void {
        // WebSocketSrv.sendCommand(CommandsType.help);
        this.startNewGame();
        WebSocketSrv.message$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(event => {
                if (getCommandsType(event.data) === CommandsType.map) {
                    if (this.playingFieldAsString) {
                        const diff = getPlayingFieldChanges(this.playingFieldAsString, event.data.slice(5, -1));
                        this.setState({
                            playingFieldChanges: diff,
                        });
                    } else {
                        this.setState({
                            playingFieldSize: getPlayingFieldSize(event.data.slice(5, -1)),
                            playingFieldChanges: [],
                        });
                    }
                    this.playingFieldAsString = event.data.slice(5, -1);

                    if (event.data.includes('*')) {
                      this.setState({
                        toggleTimer: false,
                      });
                    }
                }
            });
    }

    componentWillUnmount(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    private startNewGame = (level?: string): void => {
        this.playingFieldAsString = '';
        this.setState({
            playingFieldChanges: [],
            toggleTimer: false,
        });
        WebSocketSrv.sendCommand(CommandsType.new, level || this.state.gameLevel);
        WebSocketSrv.sendCommand(CommandsType.map);
    }

    private onLevelChange = (level: string): void => {
        this.setState({
            gameLevel: level,
        });
        this.startNewGame(level);
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
                    <GameSelector
                        level={this.state.gameLevel}
                        levelChange={this.onLevelChange}
                    />
                    <button
                        type="button"
                        className="App__btn"
                        onClick={() => this.startNewGame()}
                    >
                        Начать заново
                    </button>
                    <GameTimer toggle={this.state.toggleTimer} />
              </div>
              <div
                className="App__playingField"
                ref={this.playingFieldWrapperRef}
                >
                    <PlayingFieldCanvas
                        parentElement={this.playingFieldWrapperRef.current as HTMLElement}
                        playingFieldSize={this.state.playingFieldSize}
                        playingFieldChanges={this.state.playingFieldChanges}
                        select={this.selectCell}
                    />
              </div>
            </div>
        );
    }

}