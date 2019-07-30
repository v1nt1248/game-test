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
        if (this.props.select && this.props.cell.value === '') {
            this.props.select(this.props.cell);
        }
    }

    render() {
        const value = this.props.cell.value !== '0'
            ? this.props.cell.value :
            '';
        const numberClass = !!this.props.cell.value &&
            this.props.cell.value !== '0' &&
            this.props.cell.value !== '*'
                ? `mod-color-${this.props.cell.value}`
                : '';
        const openedClass = this.props.cell.value !== ''
            ? 'is-opened'
            : '';
        const crashClass = this.props.cell.value === '*'
            ? 'is-crashed'
            : '';
        const cellClasses = `PlayingFieldCell ${numberClass} ${openedClass} ${crashClass}`;
        return (
            <div className={cellClasses} onClick={this.selectCell}>
                { value }
            </div>
        );
    }
}
