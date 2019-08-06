import React, { RefObject } from 'react';
import './PlayingFieldCanvas.css';
import { PlayingFieldValue } from '../../typing';
import { getAllIcons } from '../../services';
import { FIELD_CELL_SIZE } from '../../constants';

interface Props {
    parentElement: HTMLElement;
    playingFieldSize: {width: number; height: number} | null;
    playingFieldChanges: PlayingFieldValue[] | null;
    select?: (item: PlayingFieldValue) => void;
}
interface State {
    allIcons: Record<string, HTMLImageElement>;
    cellWithFlag: {x: number; y: number} | null;
}

export default class PlayingFieldCanvas extends React.Component<Props, State> {
    private divRef!: RefObject<HTMLDivElement>;
    private divTopLeftCoords!: ClientRect;
    private canvasRef!: RefObject<HTMLCanvasElement>;
    private canvasContext!: CanvasRenderingContext2D|null;
    private playingFieldChangesOld: string = '';
    private cellWithFlagOldValue: string = '';

    private get canvasSize(): {width: number, height: number} {
        return this.props.playingFieldSize
            ? {
                width: this.props.playingFieldSize.width * FIELD_CELL_SIZE,
                height: this.props.playingFieldSize.height * FIELD_CELL_SIZE,
            }
            : { width: 0, height: 0 };
    }

    constructor(props: Props) {
        super(props);
        this.divRef = React.createRef();
        this.canvasRef = React.createRef();
        this.state = {
            allIcons: {},
            cellWithFlag: null,
        };
        this.initializationIcons();
    }

    public componentDidMount(): void {
        this.divTopLeftCoords = this.divRef.current!.getBoundingClientRect();
        this.canvasContext = this.canvasRef.current!.getContext('2d');
    }

    private async initializationIcons(): Promise<void> {
        const icons = await getAllIcons();
        this.setState({
            allIcons: icons,
        });
    }
    
    private handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>): void => {
        e.persist();
        const newClientX = e.clientX - this.divTopLeftCoords.left;
        const newClientY = e.clientY - this.divTopLeftCoords.top;
        const x = Math.trunc((newClientX + this.props.parentElement.scrollLeft) / FIELD_CELL_SIZE);
        const y = Math.trunc((newClientY + this.props.parentElement.scrollTop) / FIELD_CELL_SIZE);
        if (this.props.select) {
            this.props.select({x, y, value: ''});
        }
    }

    private handleCanvasRightClick = (e: React.MouseEvent<HTMLCanvasElement>): void => {
        e.persist();
        e.preventDefault();
        const flagX = e.clientX - this.divTopLeftCoords.left;
        const flagY = e.clientY - this.divTopLeftCoords.top;
        this.setState({
            cellWithFlag: {
                x: Math.trunc((flagX + this.props.parentElement.scrollLeft) / FIELD_CELL_SIZE) * FIELD_CELL_SIZE,
                y: Math.trunc((flagY + this.props.parentElement.scrollTop) / FIELD_CELL_SIZE) * FIELD_CELL_SIZE,
            },
        });
    }

    private saveCellWithFlagValue = (value: {x: number; y: number}): void => {
        this.cellWithFlagOldValue = JSON.stringify(value);
    }

    render() {
        if (Object.keys(this.state.allIcons).length === 10) {
            if (
                this.state.cellWithFlag &&
                this.cellWithFlagOldValue !== JSON.stringify(this.state.cellWithFlag)
            ) {
                const icon = this.state.allIcons.mark;
                this.canvasContext!.drawImage(
                    icon,
                    this.state.cellWithFlag.x,
                    this.state.cellWithFlag.y,
                );
                this.saveCellWithFlagValue(this.state.cellWithFlag);
            } else if (this.props.playingFieldChanges && !this.props.playingFieldChanges.length) {
                if (this.canvasRef && this.canvasRef.current) {
                    this.canvasRef.current!.width = this.canvasSize.width;
                    this.canvasRef.current!.height = this.canvasSize.height;
                }
                const icon = this.state.allIcons.default;
                for (let x = 0; x < this.canvasSize.width ; x = x + FIELD_CELL_SIZE) {
                    for (let y = 0; y < this.canvasSize.height; y = y + FIELD_CELL_SIZE) {
                        this.canvasContext!.drawImage(icon, x, y);
                    }
                }
                this.playingFieldChangesOld = JSON.stringify([]);
            } else if (
                this.props.playingFieldChanges &&
                this.props.playingFieldChanges.length &&
                this.playingFieldChangesOld !== JSON.stringify(this.props.playingFieldChanges)    
            ) {
                this.playingFieldChangesOld = JSON.stringify(this.props.playingFieldChanges);
                this.props.playingFieldChanges!
                    .forEach(item => {
                        let icon!: HTMLImageElement;
                        if (item.value === '*') {
                            icon = this.state.allIcons.bomb;
                        } else {
                            icon = this.state.allIcons[`o${item.value}`];
                        }
                        this.canvasContext!.drawImage(
                            icon,
                            item.x * FIELD_CELL_SIZE,
                            item.y * FIELD_CELL_SIZE,
                        );
                    });
            }
        }
        
        return (
            <div
                ref={this.divRef}
                style={{position: 'relative'}}
            >
                <canvas
                    ref={this.canvasRef}
                    onClick={this.handleCanvasClick}
                    onContextMenu={this.handleCanvasRightClick}
                />
            </div>
        );
    }
}
