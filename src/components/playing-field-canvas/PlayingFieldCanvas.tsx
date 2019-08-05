import React, { RefObject } from 'react';
import './PlayingFieldCanvas.css';
import { PlayingFieldValue } from '../../typing';
import { getAllIcons } from '../../services';

interface Props {
    parentElement: HTMLElement;
    playingField: string[][];
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
        const x = Math.trunc((newClientX + this.props.parentElement.scrollLeft)/ 16);
        const y = Math.trunc(newClientY / 16);
        if (this.props.select) {
            this.props.select({x, y, value: ''});
        }
    }

    render() {
        console.log('Into: ', this.props.playingField, this.state.allIcons);
        const cW = this.props.playingField[0].length * 16;
        const cH = this.props.playingField.length * 16;
        if (this.canvasRef && this.canvasRef.current) {
            this.canvasRef.current!.width = cW;
            this.canvasRef.current!.height = cH;
        }
        if (Object.keys(this.state.allIcons).length === 8) {
            this.canvasContext!.clearRect(0, 0, cW, cH);
            this.props.playingField
                .forEach((row, y) => {
                    row.forEach((cell, x) => {
                        let image!: HTMLImageElement;
                        switch (cell) {
                            case '':
                                image = this.state.allIcons.default;
                                break;
                            case '*':
                                image = this.state.allIcons.bomb;
                                break;
                            case '0':
                                image = this.state.allIcons.o0;
                                break;
                            case '1':
                                image = this.state.allIcons.o1;
                                break;
                            case '2':
                                image = this.state.allIcons.o2;
                                break;
                            case '3':
                                image = this.state.allIcons.o3;
                                break;
                            case '4':
                                image = this.state.allIcons.o4;
                                break;
                        }
                        this.canvasContext!.drawImage(image, x * 16, y * 16);
                    });
                });
        }
        return (
            <div ref={this.divRef} style={{position: 'relative'}}>
                <canvas
                    ref={this.canvasRef}
                    onClick={this.handleCanvasClick}
                />
            </div>
        );
    }
}
