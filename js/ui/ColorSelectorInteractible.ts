import {Component, Object, Type} from "@wonderlandengine/api";
import UiButton from "./UiButton";

import BuildController from "../gameplay/buildSystem/BuildController";


export default class ColorSelectorInteractible extends Component
{
    static TypeName = 'color-selector-interactible';
    static Properties = {
        red: {type: Type.Float},
        green: {type: Type.Float},
        blue: {type: Type.Float},
    }

    // Properties fields declaration
    private red: number;
    private green: number;
    private blue: number;

    // fields
    private _color: Float32Array;
    private _buttonComponent: UiButton;

    public override start()
    {
        this._color = new Float32Array([this.red, this.green, this.blue, 1]);

        console.log("coucou 1");
        this._buttonComponent = this.object.getComponent(UiButton); console.log("coucou 2");
        this._buttonComponent.addInteractCallback(this.onInteractHandler.bind(this));console.log("coucou 3");
    }

    private onInteractHandler(): void
    {
        BuildController.setColor(this._color);
    }
}