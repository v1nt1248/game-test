import { PlayingFieldValue } from '../App';

export function preparePlayingField(data: string): PlayingFieldValue[][] {
    const tmp = JSON.stringify(data).replace(/\\n/g, ':').split(':');
    tmp[0] = tmp[0].slice(1);
    tmp[tmp.length - 1] = tmp[tmp.length - 1].slice(0, -1);
    return tmp.reduce((r: PlayingFieldValue[][], row: string, index: number) => {
        const rowArray = row.split('');
        const newRowArray = rowArray.map((item, i) => {
            return {
                value: item.charCodeAt(0) === 9633 ? '' : item,
                x: i,
                y: index,
            };
        });
        r.push(newRowArray);
        return r;
    }, []);
}
