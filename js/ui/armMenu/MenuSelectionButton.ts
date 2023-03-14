import { Component, CustomParameter, Object, Texture, Type } from "@wonderlandengine/api";
import { vec4 } from "gl-matrix";
import { FlatTexturedMaterial } from "../../utils/materials/FlatTexturedMaterial";


export class MenuSelectionButton extends Component
{
    static TypeName: string = 'menu-selection-button';
    static Properties: Record<string, CustomParameter> = {
        iconObject: {type: Type.Object, default: null},
        iconTexture: {type: Type.Texture, default: null}
    };

    // Properties declaration
    private iconObject: Object;
    private iconTexture: Texture;

    // Color Constants
    private readonly COLOR_NORMAL = vec4.fromValues(76.0/255.0, 106.0/255.0, 134.0/255.0, 1.0);
    private readonly COLOR_ACTIVE = vec4.fromValues(255.0/255.0, 162.0/255.0, 56.0/255.0, 1.0);

    // Private fields
    private _material: FlatTexturedMaterial;
    private _iconMaterial: FlatTexturedMaterial;
    private _isActive: boolean;

    // Getters
    public get isActive(): boolean { return this._isActive; }

    public override start(): void 
    {
        this.setup();
        this.setupIcon();
    }

    public setActive(isActive: boolean): void 
    {
        this._material.color = isActive ? this.COLOR_ACTIVE : this.COLOR_NORMAL;
        this._isActive = isActive;
    }

    private setup(): void
    {
        const tempMesh = this.object.getComponent('mesh');
        if(!tempMesh) throw new Error('Component MenuSelectionButton require a mesh Component');

        this._material = tempMesh.material?.clone() as FlatTexturedMaterial;
        if(this._material) throw new Error('Component MenuSelectionButton require a material');

        tempMesh.material = this._material;

        // Set to not selected by default
        this._material.color = this.COLOR_NORMAL;
        this._isActive = false;
    }

    private setupIcon(): void
    {
        const iconTempMesh = this.iconObject.getComponent('mesh');
        if(!iconTempMesh) throw new Error('Component MenuSelectionButton require a mesh Component');

        this._iconMaterial = iconTempMesh.material?.clone() as FlatTexturedMaterial;
        if(this._iconMaterial) throw new Error('Component MenuSelectionButton require a material');

        iconTempMesh.material = this._iconMaterial;
        this._iconMaterial.flatTexture = this.iconTexture;
    }
}