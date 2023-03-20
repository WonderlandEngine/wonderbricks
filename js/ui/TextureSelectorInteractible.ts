import {Component, CustomParameter, MeshComponent, Object, Type} from "@wonderlandengine/api";
import {UiButton} from "./UiButton";

import BuildController from "../gameplay/buildSystem/BuildController";
import { TextureInformation } from "../utils/textures/TextureInformation";
import { TextureSelectionPanel } from "./armMenu/TextureSelectionPanel";
import { vec4 } from "gl-matrix";


export class TextureSelectorInteractible extends Component
{
    static TypeName: string = 'texture-selector-interactible';
    static Properties: Record<string, CustomParameter> = {
        textureInfoObject: { type: Type.Object, default: null }
    };

    private textureInfoObject: Object;

    // fields
    private _texture: TextureInformation;
    private _buttonComponent: UiButton;
    private _mesh: MeshComponent;

    private _parent: TextureSelectionPanel;

    public override start()
    {
        if(!this.textureInfoObject)
        {
            console.error('Object must be set to initialize the button ', this.object.name);
            return;
        }

        this._texture = this.textureInfoObject.getComponent(TextureInformation);

        this._buttonComponent = this.object.getComponent(UiButton);
        this._buttonComponent.addInteractCallback(this.onInteractHandler.bind(this));

        this._mesh = this.object.getComponent('mesh');
        let material = this._mesh.material;
        this._mesh.material = material.clone();

        // Get parent BlockSelectionPanel component
        this._parent = this.object.parent.getComponent(TextureSelectionPanel);
        this._parent.registerButton(this);
    }

    public setVisualColor(color: vec4): void 
    {
        this._mesh.material['color'] = color;
    }

    private onInteractHandler(): void
    {
        BuildController.setTexture(this._texture);
    }
}