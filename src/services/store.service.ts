import { Subject, Observable } from 'rxjs';
import { PlayingFieldCoords } from '../typing';

export class Store {
    private data: string[] = [];
    private changeFullData: Subject<string[]> = new Subject();
    private change: Subject<{coords: string, value: boolean}> = new Subject();

    public get change$(): Observable<{coords: string, value: boolean}> {
        return this.change.asObservable();
    }

    public get changeFullData$(): Observable<string[]> {
        return this.changeFullData.asObservable();
    }

    public clearStore(): void {
        this.data = [];
        this.changeFullData.next(this.data);
    }

    public getFullData(): string[] {
        return this.data;
    }

    public addPosition(coords: PlayingFieldCoords, quiet: boolean = false): void {
        const item = `${coords.y}:${coords.x}`;
        if (!this.data.includes(item)) {
            this.data.push(item);
            if (!quiet) {
                this.changeFullData.next(this.data);
                this.change.next({coords: item, value: true});
            }
        }
    }

    public removePosition(coords: PlayingFieldCoords, quiet: boolean = false): void {
        const item = `${coords.y}:${coords.x}`;
        const itemIndex = this.data.indexOf(item);
        if (itemIndex > -1) {
            this.data.splice(itemIndex, 1);
            if (!quiet) {
                this.changeFullData.next(this.data);
                this.change.next({coords: item, value: false});
            }
        }
    }

    public refreshGameMap(map: string[][]): string[][] {
        const flagsToDelete: PlayingFieldCoords[] = [];
        this.data.forEach(flag => {
            const flagCoordsArray = flag.split(':');
            const flagCoords = {
                x: Number(flagCoordsArray[0]),
                y: Number(flagCoordsArray[1]),
            };
            const mapCellValue = map[flagCoords.x][flagCoords.y];
            if (mapCellValue === '') {
                map[flagCoords.x][flagCoords.y] = '💣';
            } else {
                flagsToDelete.push({x: flagCoords.x, y: flagCoords.y});
            }
        });
        flagsToDelete.forEach(flag => this.removePosition(flag, true));
        return map;
    }
}