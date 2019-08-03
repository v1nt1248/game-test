import React from 'react';
import './PlayingFieldCanvas.css';
import { PlayingFieldValue } from '../../typing';

interface Props {
    // parentElement: ClientRect|undefined;
    playingField: string[][];
    select?: (item: PlayingFieldValue) => void;
}
interface State {}

export default class PlayingFieldCanvas extends React.Component<Props, State> {
    private handleCanvasClick = (e: any): void => {
        e.persist();
        console.log(e, e.clientX, e.clientY);
    }

    private createGrid(cW: number, cH: number): string {
        const cnv = document.createElement('canvas');
        cnv.width = cW;
        cnv.height = cH;
        const ctx = cnv.getContext('2d');
        ctx!.strokeStyle = 'blue';
        for (let x = -0.5; x < (cW - 1); x += 16) {
            console.log('X: ', x);
            ctx!.strokeRect(x, 0, 0.1, (cH - 1));
        }
        for (let y = -0.5; y < (cH - 1); y += 16) {
            console.log('Y: ', y);
            ctx!.strokeRect(0, y, (cW - 1), 0.1);
        }
        return cnv.toDataURL();
    }

    render() {
        const cW = this.props.playingField[0].length * 16;
        const cH = this.props.playingField.length * 16;
        return (
            <canvas
                ref='canvas'
                style={{'backgroundColor': '#ffffff'}}
                width={cW}
                height={cH}
                onClick={this.handleCanvasClick}
            ></canvas>
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