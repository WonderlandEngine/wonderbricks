import {vec3} from 'gl-matrix';
import GridLayer from './GridLayer.js';
import {math} from '@wonderlandengine/api';

/**
 * Represent a logical grid
 */
export default class Grid {
    private _gridData: Array<GridLayer>;
    private _gridSize: number;
    private _layerCount: number;
    private _cellSize: number;

    private _gridOffset: number;

    public get gridSize() {
        return this._gridSize;
    }
    public get layerCount() {
        return this._layerCount;
    }
    public get cellSize() {
        return this._cellSize;
    }

    public constructor(size: number, layerCount: number, cellSize) {
        this._gridSize = size;
        this._layerCount = layerCount;
        this._cellSize = cellSize;
        this._gridOffset = (this._gridSize * this._cellSize) / 2.0;

        this._gridData = new Array<GridLayer>(this._layerCount);

        for (let i = 0; i < this._layerCount; ++i) {
            this._gridData[i] = new GridLayer(this._gridSize);
        }

        console.log(this._gridData);
    }

    /**
     * Return position on the grid for the given indices
     * @param worldPos
     */
    public getCellPositionVec3(worldPos: vec3): vec3 {
        return this.getCellPosition(worldPos[0], worldPos[1], worldPos[2]);
    }

    /**
     * Return position on the grid for the given indices
     * @param x
     * @param y
     * @param z
     */
    public getCellPosition(x: number, y: number, z: number): vec3 {
        let position = vec3.create();
        position[1] = y * this._cellSize; // y coordinate
        position[0] = x * this._cellSize - this._gridOffset; // x coordinate
        position[2] = z * this._cellSize - this._gridOffset; // z coordinate

        return position;
    }

    /**
     * Return cell indices from a world position
     * @param x
     * @param y
     * @param z
     */
    public getCellIndices(x: number, y: number, z: number): vec3 {
        let indices = vec3.create();
        indices[0] = Math.round((x + this._gridOffset) / this._cellSize);
        indices[1] = Math.floor(y / this._cellSize);
        indices[2] = Math.round((z + this._gridOffset) / this._cellSize);

        return indices;
    }
}
