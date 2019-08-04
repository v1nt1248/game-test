import React from 'react';
import './PlayingFieldCanvas.css';
import { PlayingFieldValue } from '../../typing';
import { getAllIcons } from '../../services';

interface Props {
    // parentElement: ClientRect|undefined;
    playingField: string[][];
    select?: (item: PlayingFieldValue) => void;
}
interface State {
    allIcons: Record<string, HTMLImageElement>;
    canvasContext: CanvasRenderingContext2D|null;
}

export default class PlayingFieldCanvas extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            allIcons: {},
            canvasContext: null,
        };
        this.initializationIcons();
    }

    private async initializationIcons(): Promise<void> {
        const icons = await getAllIcons();
        this.setState({
            allIcons: icons,
        });
    }

    private getCanvasContext = (canvas: HTMLCanvasElement): void => {
        if (canvas && !this.state.canvasContext) {
            const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;
            this.setState({
                canvasContext,
            });
            console.log(canvasContext);
        }
    }
    
    private handleCanvasClick = (e: any): void => {
        e.persist();
        console.log(e, e.clientX, e.clientY);
    }

    render() {
        const cW = this.props.playingField[0].length * 16;
        const cH = this.props.playingField.length * 16;
        if (
            Object.keys(this.state.allIcons).length === 8 &&
            !!this.state.canvasContext
        ) {
            this.state.canvasContext.clearRect(0, 0, cW, cH);
            this.props.playingField
                .forEach((row, y) => {
                    row.forEach((cell, x) => {
                        let image!: HTMLImageElement;
                        switch (cell) {
                            case '':
                                image = this.state.allIcons.default;
                                break;
                            case '💣':
                                image = this.state.allIcons.bomb;
                                break;
                            case '0':
                                image = this.state.allIcons.o0;
                                break;
                        }
                        this.state.canvasContext!.drawImage(image, x * 16, y * 16);
                    });
                });
        }
        return (
            <div style={{position: 'relative'}}>
                {
                    Object.keys(this.state.allIcons).length === 8 &&
                    <canvas
                        ref={(c) => this.getCanvasContext(c as HTMLCanvasElement)}
                        style={{'backgroundColor': '#ffffff'}}
                        width={cW}
                        height={cH}
                        onClick={this.handleCanvasClick}
                    />
                }
                
            </div>
        );
    }
}

/*
function getCoords(elem: Element): {top: number, left: number} {
    const box = elem.getBoundingClientRect();
    const body = document.body;
    const docEl = document.documentElement;

    const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    const clientTop = docEl.clientTop || body.clientTop || 0;
    const clientLeft = docEl.clientLeft || body.clientLeft || 0;

    const top = box.top + scrollTop - clientTop;
    const left = box.left + scrollLeft - clientLeft;

    return {top, left};
}
*/