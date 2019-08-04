const icons: Record<string, string> = {
    default: 'default.svg',
    mark: 'mark.svg',
    bomb: 'bomb.svg',
    o0: 'opened-0.svg',
    o1: 'opened-1.svg',
    o2: 'opened-2.svg',
    o3: 'opened-3.svg',
    o4: 'opened-4.svg',
};

const allIcons = [ 'default', 'mark', 'bomb', 'o0', 'o1', 'o2', 'o3', 'o4'];

function getIcon(name: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.addEventListener('load', e => resolve(img));
        img.addEventListener('error', () => {
            reject(new Error('Ошибка загрузки иконки'));
        });
        img.src = `${process.env.PUBLIC_URL}/icons/${icons[name]}`;
        img.width = 16;
        img.height = 16;
    });
}

export async function getAllIcons(): Promise<Record<string, HTMLImageElement>> {
    const promises = allIcons.map(icon => getIcon(icon));
    const icons = await Promise.all(promises);
    return {
        default: icons[0],
        mark: icons[1],
        bomb: icons[2],
        o0: icons[3],
        o1: icons[4],
        o2: icons[5],
        o3: icons[6],
        o4: icons[7],
    };
}
