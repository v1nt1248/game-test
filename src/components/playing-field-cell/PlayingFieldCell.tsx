import React from 'react';
import './PlayingFieldCell.css';
import { PlayingFieldCoords, PlayingFieldValue } from '../../typing';
import { StoreSrv } from '../../services';

interface Props {
    cell: PlayingFieldValue;
    select?: (coords: PlayingFieldCoords) => void;
}
interface State {}

export default class PlayingFieldCell extends React.Component<Props, State> {
    private clickCount: number = 0;
    private singleClickTimer!: NodeJS.Timeout;

    private selectCell = (): void => {
        this.clickCount++;
        if (this.clickCount === 1) {
            this.singleClickTimer = setTimeout(() => {
                this.clickCount = 0;
                this.singleClick();
            }, 250);
        } else if (this.clickCount === 2) {
            clearTimeout(this.singleClickTimer);
            this.clickCount = 0;
            this.doubleClick();
        }
    }

    private doubleClick = (): void => {
        if (
            this.props.select &&
            (
                this.props.cell.value === '' ||
                this.props.cell.value === '💣'
            )
         ) {
            this.props.select({x: this.props.cell.x, y: this.props.cell.y});
        }
    }

    private singleClick = (): void => {
        if (this.props.cell.value === '') {
            StoreSrv.addPosition({x: this.props.cell.x, y: this.props.cell.y});
        } else if (this.props.cell.value === '💣') {
            StoreSrv.removePosition({x: this.props.cell.x, y: this.props.cell.y});
        }
    }

    render() {
        const value = this.props.cell.value !== '0'
            ? this.props.cell.value :
            '';
        const numberClass = !!this.props.cell.value &&
            this.props.cell.value !== '0' &&
            this.props.cell.value !== '*' &&
            this.props.cell.value !== '💣'
                ? `mod-color-${this.props.cell.value}`
                : '';
        const flagClass = this.props.cell.value === '💣'
            ? 'mod-flag'
            : '';
        const openedClass = this.props.cell.value !== '' &&
            this.props.cell.value !== '💣'
                ? 'is-opened'
                : '';
        const crashClass = this.props.cell.value === '*'
            ? 'is-crashed'
            : '';
        const cellClasses = `PlayingFieldCell ${numberClass} ${openedClass} ${crashClass} ${flagClass}`;
        return (
            <div className={cellClasses} onClick={this.selectCell}>
                { value }
            </div>
        );
    }
}
