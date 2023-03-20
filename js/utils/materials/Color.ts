import { vec4 } from "gl-matrix";

/**
 * Util class to handle RGB colors
 * Plan to add color manipulation features (mix, blend, ...)
 */
export class Color
{
    public static readonly COLOR_NORMAL = vec4.fromValues(76.0/255.0, 106.0/255.0, 134.0/255.0, 1.0);
    public static readonly COLOR_ACTIVE = vec4.fromValues(255.0/255.0, 162.0/255.0, 56.0/255.0, 1.0);

    public static readonly COLOR_TINT_NORMAL = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    public static readonly COLOR_TINT_ACTIVE = vec4.fromValues(0.8, 0.8, 0.8, 1.0);

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