import { Component, CustomParameter, MeshComponent, Object, Texture, Type, WASM } from "@wonderlandengine/api";
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
    private _mesh: MeshComponent;
    private _material: FlatTexturedMaterial;
    private _iconMaterial: FlatTexturedMaterial;
    private _isActive: boolean;

    // Getters
    public get isActive(): boolean { return this._isActive; }
    public get button(): UiButton { return this._button; }

    public override init(): void 
    {
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
        // NOTE: since it seems that it's not possible to keep a reference
        // to the WASM instance of the material, it's mandatory to modify the material value
        // through the array access notation... 
        this._mesh.material['color'] = isActive ? this.COLOR_ACTIVE : this.COLOR_NORMAL;
        this._isActive = isActive;
    }

    private setup(): void
    {
        // === Button setup ===
        this._button = this.object.getComponent(UiButton);

        // === Visual setup ===
        this._mesh = this.object.getComponent('mesh');
        this._material = this._mesh.material?.clone() as FlatTexturedMaterial;
        this._mesh.material = this._material;

        // Set to not selected by default
        this._material.color = this.COLOR_NORMAL;
        this._isActive = false;
    }

    private setupIcon(): void
    {
        const iconTempMesh = this.iconObject.getComponent('mesh');
        this._iconMaterial = iconTempMesh.material?.clone() as FlatTexturedMaterial;

        iconTempMesh.material = this._iconMaterial;
        this._iconMaterial.flatTexture = this.iconTexture;
    }
}