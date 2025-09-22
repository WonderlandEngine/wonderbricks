import Grid from './Grid.js';

class GridManager {
    private _grid: Grid;

    public get grid() {
        return this._grid;
    }

    public constructor(size: number, layoutCount: number, cellSize: number) {
        this._grid = new Grid(size, layoutCount, cellSize);
    }
}

export default new GridManager(30, 10, 0.25);
