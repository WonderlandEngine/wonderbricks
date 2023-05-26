import { Component, ComponentProperty, MeshComponent, Object, Texture, Type } from "@wonderlandengine/api";
import { vec4 } from "gl-matrix";
import { Color } from "../../utils/materials/Color.js";
import { FlatTexturedMaterial } from "../../utils/materials/FlatTexturedMaterial.js";
import { UiButton } from "../UiButton.js";


/**
 * Class MenuSelectionButton.
 * Represente buttons for menu selection on the arm menu.
 */
export class MenuSelectionButton extends Component
{
    static TypeName: string = 'menu-selection-button';
    static Properties: Record<string, ComponentProperty> = {
        iconObject: {type: Type.Object, default: null},
        iconTexture: {type: Type.Texture, default: null}
    };

    // Properties declaration
    private iconObject: Object;
    private iconTexture: Texture;

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
        this._mesh.material['color'] = isActive ? Color.COLOR_ACTIVE : Color.COLOR_NORMAL;
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
        this._material.color = Color.COLOR_NORMAL;
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