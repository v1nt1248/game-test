import React from 'react';
import './GameTimer.css';

interface Props {
    toggle: boolean;
}
interface State {
    seconds: number;
}

export default class GameTimer extends React.Component<Props, State> {
    private timer: number|undefined = undefined;
    constructor(props: Props) {
        super(props);
        this.state = {
          seconds: 0,
        };
      }

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
        if (this.props.toggle !== nextProps.toggle) {
            nextProps.toggle
            ? this.startTimer()
            : this.stopTimer();
            return true;
        }
        if (this.state.seconds !== nextState.seconds) {
            return true;
        }
        return false;
    }

    componentWillUnmount() {
        this.stopTimer();
    }

    private startTimer(): void {
        if (this.state.seconds !== 0) {
            this.setState({
                seconds: 0,
            });
        }
        this.timer = setInterval(() => {
            this.tick();
        }, 1000) as any as number;
    }

    private stopTimer(): void {
        clearInterval(this.timer);
    }
    
    private tick() {
        this.setState({
            seconds: this.state.seconds + 1,
        })
    }
    
    render() {
        return (
            <div className="GameTimer">
                Прошло {this.state.seconds} секунд
            </div>
        )
    }
}
