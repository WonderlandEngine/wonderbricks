/**
 * Represent a logical grid
 */
import {Object} from "@wonderlandengine/api";
import GridLayer from "./GridLayer";


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
}