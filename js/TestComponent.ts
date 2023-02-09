import {Component, MeshComponent, Type} from "@wonderlandengine/api";

export class SecondTestComponent extends Component
{
    static TypeName = "second";
    static Properties = {
        test: {type: Type.Int, default: 1}
    };

    // Properties fields declaration
    private test: number;

    private _mesh: MeshComponent;

    start() {
        console.log(this.test);
        this._mesh = this.object.getComponent("mesh");
        let mat = this._mesh.material.clone();
        this._mesh.material = mat;
        mat['diffuseColor'] = [1,1,1,1];
        mat['ambientColor'] = [0,0,0,1];
        mat['specularColor'] = [1,0,0,1];
    }
}