import {Component, Material, MeshComponent, Texture, Type} from "@wonderlandengine/api";


export class SimplePreviewBlockCreator extends Component
{
    static TypeName = 'simple-preview-block-creator';
    static Properties = {
        material: {type: Type.Material, default: null},
        albedoMap: {type: Type.Texture, default: null},
        normalMap: {type: Type.Texture, default: null}
    };

    private material: Material;
    private albedoMap: Texture;
    private normalMap: Texture;

    private _mesh: MeshComponent;

    public override start()
    {
        this._mesh = this.object.getComponent('mesh');

        let tempMat = this.material.clone();
        tempMat['occlusionTexture'] = this.albedoMap;
        tempMat['normalTexture'] = this.normalMap;

        this._mesh.material = tempMat;
    }
}