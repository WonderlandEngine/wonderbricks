import { Component, CustomParameter, MeshComponent, Object, Texture, Type } from "@wonderlandengine/api";
import { vec4 } from "gl-matrix";
import { FlatTexturedMaterial } from "../../utils/materials/FlatTexturedMaterial";
import { UiButton } from "../UiButton";


/**
 * Class MenuSelectionButton.
 * Represente buttons for menu selection on the arm menu.
 */
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
    private _button: UiButton;
    private _material: FlatTexturedMaterial;
    private _iconMaterial: FlatTexturedMaterial;
    private _isActive: boolean;

    // Getters
    public get isActive(): boolean { return this._isActive; }
    public get button(): UiButton { return this._button; }

    public override start(): void 
    {
        super.start();

        this.setup();
        this.setupIcon();
    }

    /**
     * Change the visual appearance of the button based on
     * given properties
     * @param isActive 
     */
    public setActive(isActive: boolean): void 
    {
        this._material.color = isActive ? this.COLOR_ACTIVE : this.COLOR_NORMAL;
        this._isActive = isActive;
    }

    private setup(): void
    {
        // === Button setup ===
        this._button = this.object.getComponent(UiButton);
        if(!this._button) this.throwMissingComponent(UiButton.TypeName);

        // === Visual setup ===
        const tempMesh = this.object.getComponent('mesh');
        if(!tempMesh) this.throwMissingComponent(MeshComponent.TypeName);

        this._material = tempMesh.material?.clone() as FlatTexturedMaterial;
        if(this._material) this.throwMissingComponent('Material');

        tempMesh.material = this._material;

        // Set to not selected by default
        this._material.color = this.COLOR_NORMAL;
        this._isActive = false;
    }

    private setupIcon(): void
    {
        const iconTempMesh = this.iconObject.getComponent('mesh');
        if(!iconTempMesh) this.throwMissingComponent(MeshComponent.TypeName);

        this._iconMaterial = iconTempMesh.material?.clone() as FlatTexturedMaterial;
        if(this._iconMaterial) this.throwMissingComponent('Material');

        iconTempMesh.material = this._iconMaterial;
        this._iconMaterial.flatTexture = this.iconTexture;
    }

    private throwMissingComponent(component: string)
    {
        throw new Error(`Component MenuSelectionButton require a ${component} Component`);
    }
}