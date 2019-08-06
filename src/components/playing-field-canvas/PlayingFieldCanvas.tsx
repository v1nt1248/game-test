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
}

export default class PlayingFieldCanvas extends React.Component<Props, State> {
    private divRef!: RefObject<HTMLDivElement>;
    private divTopLeftCoords!: ClientRect;
    private canvasRef!: RefObject<HTMLCanvasElement>;
    private canvasContext!: CanvasRenderingContext2D|null;

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
    
    private handleCanvasClick = (e: any): void => {
        e.persist();
        const newClientX = e.clientX - this.divTopLeftCoords.left;
        const newClientY = e.clientY - this.divTopLeftCoords.top;
        const x = Math.trunc((newClientX + this.props.parentElement.scrollLeft) / FIELD_CELL_SIZE);
        const y = Math.trunc((newClientY + this.props.parentElement.scrollTop) / FIELD_CELL_SIZE);
        console.log('x: ', x, ' y: ', y);
        if (this.props.select) {
            this.props.select({x, y, value: ''});
        }
    }

    render() {
        if (this.canvasRef && this.canvasRef.current) {
            this.canvasRef.current!.width = this.canvasSize.width;
            this.canvasRef.current!.height = this.canvasSize.height;
        }

        if (Object.keys(this.state.allIcons).length === 8) {
            if (this.props.playingFieldChanges && !this.props.playingFieldChanges.length) {
                const icon = this.state.allIcons.default;
                for (let x = 0; x < this.canvasSize.width ; x = x + FIELD_CELL_SIZE) {
                    for (let y = 0; y < this.canvasSize.height; y = y + FIELD_CELL_SIZE) {
                        this.canvasContext!.drawImage(icon, x, y);
                    }
                }
            } else if (this.props.playingFieldChanges && this.props.playingFieldChanges.length) {
                this.props.playingFieldChanges!
                    .forEach(item => {
                        let icon!: HTMLImageElement;
                        switch (item.value) {
                            case '*':
                                icon = this.state.allIcons.bomb;
                                break;
                            case '0':
                                icon = this.state.allIcons.o0;
                                break;
                            case '1':
                                icon = this.state.allIcons.o1;
                                break;
                            case '2':
                                icon = this.state.allIcons.o2;
                                break;
                            case '3':
                                icon = this.state.allIcons.o3;
                                break;
                            case '4':
                                icon = this.state.allIcons.o4;
                                break;
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
                />
            </div>
        );
    }
}
