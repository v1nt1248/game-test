import { PlayingFieldValue } from "../typing";

export function getPlayingFieldChanges(oldValue: string, newValue: string): PlayingFieldValue[] {
    const oldValueParsed = JSON.stringify(oldValue).replace(/\\n/g, ':').split(':');
    oldValueParsed[0] = oldValueParsed[0].slice(1);
    oldValueParsed[oldValueParsed.length - 1] = oldValueParsed[oldValueParsed.length - 1].slice(0, -1);

    const newValueParsed = JSON.stringify(newValue).replace(/\\n/g, ':').split(':');
    newValueParsed[0] = newValueParsed[0].slice(1);
    newValueParsed[oldValueParsed.length - 1] = newValueParsed[oldValueParsed.length - 1].slice(0, -1);

    const res = [];
    for (let yIndex = 0; yIndex < newValueParsed.length; yIndex++) {
        const yValueOld = oldValueParsed[yIndex];
        if (newValueParsed[yIndex] === yValueOld) {
            continue;
        }
        for (let xIndex = 0; xIndex < newValueParsed[yIndex].length; xIndex++) {
            if (newValueParsed[yIndex][xIndex] !== yValueOld[xIndex]) {
                res.push({x: xIndex, y: yIndex, value: newValueParsed[yIndex][xIndex]});
            }
        }
    }

    return res;
}