import { vec3 } from "gl-matrix";
import GridLayer from "./GridLayer";
import {math} from "@wonderlandengine/api";

/**
 * Represent a logical grid
 */
export default class Grid
{
    private _gridData: Array<GridLayer>;
    private _gridSize: number;
    private _layerCount: number;

    public get gridSize() { return this._gridSize; }
    public get layerCount() { return this._layerCount; }

    public constructor(size: number, layerCount: number)
    {
        this._gridSize = size;
        this._layerCount = layerCount;

        this._gridData = new Array<GridLayer>(this._layerCount);

        for (let i = 0; i < this._layerCount; ++i)
        {
            this._gridData[i] = new GridLayer(this._gridSize);
        }

        console.log(this._gridData);
    }

    /**
     * Return position on the grid for the given indices
     * @param x
     * @param y
     * @param z
     */
    public getCellPosition(x: number, y: number, z: number): vec3
    {
        let position = vec3.create();
        position[1] = y; // y coordinate
        position[0] = x - (this._gridSize / 2.0); // x coordinate
        position[2] = z - (this._gridSize / 2.0); // z coordinate

        return position;
    }

    /**
     * Return cell indices from a world position
     * @param x
     * @param y
     * @param z
     */
    public getCellIndices(x: number, y: number, z:number): vec3
    {
        let indices = vec3.create();
        indices[0] = Math.floor(x);
        indices[1] = Math.floor(y);
        indices[2] = Math.floor(z);

        return indices;
    }
}