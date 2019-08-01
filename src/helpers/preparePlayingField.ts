export function preparePlayingField(data: string): string[][] {
    const tmp = JSON.stringify(data).replace(/\\n/g, ':').split(':');
    tmp[0] = tmp[0].slice(1);
    tmp[tmp.length - 1] = tmp[tmp.length - 1].slice(0, -1);
    return tmp.reduce((r: string[][], row: string, index: number) => {
        const rowArray = row.split('');
        const newRowArray = rowArray.map(item => item.charCodeAt(0) === 9633 ? '' : item);
        r.push(newRowArray);
        return r;
    }, []);
}
