import {Component, MeshComponent, Type} from "@wonderlandengine/api";
import {vec4} from "gl-matrix";
import Grid from "./gameplay/grid/Grid";

export class SecondTestComponent extends Component
{
    static TypeName = "second";
    static Properties = {
        test: {type: Type.Int, default: 1},

        // Color
        colorR: {type: Type.Float, default: 1},
        colorG: {type: Type.Float, default: 1},
        colorB: {type: Type.Float, default: 1},
        colorA: {type: Type.Float, default: 1},
    };

    // Properties fields declaration
    private test: number;

    private colorR: number;
    private colorG: number;
    private colorB: number;
    private colorA: number;
    private color: vec4;

    // Components caching
    private _mesh: MeshComponent;

    public override start()
    {
        this._mesh = this.object.getComponent("mesh");

        // Get material and create a copy to operate safely
        let mat = this._mesh.material.clone();
        this._mesh.material = mat;

        // Compose color
        this.color = [
            this.colorR,
            this.colorG,
            this.colorB,
            this.colorA
        ]

        console.log(this.color);

        // Change material properties (key access)
        mat['diffuseColor'] = this.color;
        mat['ambientColor'] = [0,0,0,1];
        mat['specularColor'] = [1,0,0,1];
    }
}