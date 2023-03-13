import {Component, CustomParameter, Object, Type} from "@wonderlandengine/api";
import {UiButton} from "./UiButton";

import BuildController from "../gameplay/buildSystem/BuildController";
import { TextureInformation } from "../utils/textures/TextureInformation";


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
    }

    private onInteractHandler(): void
    {
        BuildController.setTexture(this._texture);
    }
}