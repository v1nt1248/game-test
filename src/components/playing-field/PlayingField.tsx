import React from 'react';
import './PlayingField.css';
import { PlayingFieldValue } from '../../App';
import PlayingFieldCell from '../playing-field-cell/PlayingFieldCell';

interface Props {
    playingField: PlayingFieldValue[][];
    select?: (item: PlayingFieldValue) => void;
}
interface State {}

export default class PlayingField extends React.Component<Props, State> {
    private selectCell = (cell: PlayingFieldValue): void => {
        if (this.props.select) {
            this.props.select(cell);
        }
    }

    render() {
        return (
            <div className="PlayingField">
                {
                    this.props.playingField
                        .map(row => 
                            <div className="PlayingField__row" key={row[0].y}>
                                {
                                    row.map(c => 
                                        <PlayingFieldCell cell={c} key={c.x} select={this.selectCell}/>
                                    )
                                }
                            </div>
                        )
                }
            </div>
        );
    }
}
