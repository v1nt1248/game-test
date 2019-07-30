import React, { ChangeEvent } from 'react';
import './GameSelector.css';

interface Props {
    level: string;
    levelChange: (level: string) => void;
}
interface State {}

const allGameLevel = ['1', '2', '3', '4']

export default class GameSelector extends React.Component<Props, State> {
    private selectLevel = (event: ChangeEvent<HTMLSelectElement>): void => {
        event.persist();
        if (this.props.levelChange) {
            this.props.levelChange(event.target.value);
        }
    }

    render() {
        return (
            <div className="GameSelector">
                <h4 className="GameSelector__title">Выберите уровень игры</h4>
                <select className="GameSelector__select" name='select' value={this.props.level} onChange={this.selectLevel}>
                    {
                        allGameLevel.map(item => 
                            <option value={item} key={item}>
                                { item }
                            </option>
                        )
                    }
                </select>
            </div>
        )
    }
}
