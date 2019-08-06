export function getPlayingFieldSize(map: string): {width: number; height: number} | null {
    if (!map) { return null; }
    const mapValueParsed = JSON.stringify(map).replace(/\\n/g, ':').split(':');
    mapValueParsed[0] = mapValueParsed[0].slice(1);
    mapValueParsed[mapValueParsed.length - 1] = mapValueParsed[mapValueParsed.length - 1].slice(0, -1);
    return {
        width: mapValueParsed[0].length,
        height: mapValueParsed.length,
    };
}