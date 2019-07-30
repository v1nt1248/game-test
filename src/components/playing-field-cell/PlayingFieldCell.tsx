import React from 'react';
import './PlayingFieldCell.css';
import { PlayingFieldValue } from '../../App';

interface Props {
    cell: PlayingFieldValue;
    select?: (item: PlayingFieldValue) => void;
}
interface State {}

export default class PlayingFieldCell extends React.Component<Props, State> {
    private selectCell = (): void => {
        if (this.props.select) {
            this.props.select(this.props.cell);
        }
    }

    render() {
        const value = this.props.cell.value !== '0'
            ? this.props.cell.value :
            '';
        return (
            <div className="PlayingFieldCell" onClick={this.selectCell}>
                { value }
            </div>
        );
    }
}
