import React from 'react';
import './PlayingField.css';
import { PlayingFieldCoords } from '../../typing';
import PlayingFieldCell from '../playing-field-cell/PlayingFieldCell';

interface Props {
    playingField: string[][];
    select?: (coords: PlayingFieldCoords) => void;
}
interface State {}

export default class PlayingField extends React.Component<Props, State> {
    private selectCell = (coords: PlayingFieldCoords): void => {
        if (this.props.select) {
            this.props.select(coords);
        }
    }

    render() {

        return (
            <div className="PlayingField">
                {
                    this.props.playingField
                        .map((row, rowIndex) => 
                            <div className="PlayingField__row" key={rowIndex}>
                                {
                                    row.map((c, cellIndex) => 
                                        <PlayingFieldCell
                                            cell={{value: c, x: cellIndex, y: rowIndex}}
                                            key={`${rowIndex}${cellIndex}`}
                                            select={() => this.selectCell({x: cellIndex, y: rowIndex})}
                                        />
                                    )
                                }
                            </div>
                        )
                }
            </div>
        );
    }
}
