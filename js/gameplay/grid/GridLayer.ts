import {Object} from "@wonderlandengine/api";

/**
 * Represent a logical grid layer (bi dimensional)
 */
export default class GridLayer
{
    private _layerData: Array<Array<Object>>
    private _layerSize: number;

    public constructor(size: number)
    {
        this._layerSize = size;
        this._layerData = new Array<Array<Object>>(this._layerSize);

        for (let i = 0; i < this._layerSize; ++i)
        {
            this._layerData[i] = new Array<Object>(this._layerSize);
        }
    }
}