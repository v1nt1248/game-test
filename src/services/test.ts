const mockData: Record<string, string>  = {
    pap: 'middle-upper class',
    mom: 'middle-upper class',
    tom: 'lower-middle class',
    queen: 'upper-upper-upper-upper class',
};

interface Person {
    name: string;
    class: string;
}

function sortByClass(data: Record<string, string>): string[] {
    const innerData: Record<string, string> = JSON.parse(JSON.stringify(mockData));
    let classesListMaxLength: number = 0;

    const newData = Object.keys(innerData)
        .reduce((res: Record<string, string[]>, name: string) => {
            res[name] = innerData[name]
                .replace(' class', '')
                .split('-')
                .reverse();
            classesListMaxLength = res[name].length > classesListMaxLength
                ? res[name].length
                : classesListMaxLength;
            return res;
        }, {} as Record<string, string[]>)

    const newDataTransformed = Object.keys(newData)
        .reduce((res: Person[], name: string) => {
            let arr = [...newData[name]];
            const diffLength = classesListMaxLength - arr.length;
            if (diffLength) {
                arr = [...arr, ...new Array(diffLength).fill('middle')];
            }
            res.push({name, class: arr.join('-')});
            return res;
        }, [] as Person[]);

    return newDataTransformed
        .sort((a: Person, b: Person) => {
            if (a.class === b.class) {
                return b.name > a.name ? 1 : -1;
            }
            return b.class > a.class ? 1 : -1;
        })
        .map(p => p.name);
}


export function testTaskForSorting(): void {
    const sortedPersonsByClass = sortByClass(mockData);
    console.log('Original data: ', mockData);
    console.log('Sorted data by class: ', sortedPersonsByClass);
}