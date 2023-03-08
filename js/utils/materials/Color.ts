import { vec4 } from "gl-matrix";

/**
 * Util class to handle RGB colors
 * Plan to add color manipulation features (mix, blend, ...)
 */
export class Color
{
    private _value: vec4;

    public constructor(r: number, g: number, b: number, a: number)
    {
        this._value = [r, g, b, a];
    }

    public static createRGB(r: number, g: number, b: number): Color
    {
        return new Color(r, g, b, 1.0);
    }

    public asArray(): vec4 { return this._value; }
}