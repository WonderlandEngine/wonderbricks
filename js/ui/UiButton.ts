import {Material, MeshComponent, Object, TextComponent, Type} from "@wonderlandengine/api";
import {TagComponent} from "../utils/TagComponent";
import {Tag} from "../utils/Tag";
import {UiElementBase} from "./UiElementBase";


export class UiButton extends UiElementBase
{
    static TypeName = 'ui-button';
    static Properties = {
        textObject: {type: Type.Object},
        visualFeedbackEnabled: {type: Type.Bool, default: true}
    }

    // Properties declaration
    private textObject: Object;
    private visualFeedbackEnabled: boolean;

    // Class fields
    private _meshComponent: MeshComponent;
    private _meshMaterial: Material;
    private _textComponent: TextComponent;

    public start(): void
    {
        // Create a copy of the material instance
        this._meshComponent = this.object.getComponent('mesh');
        this._meshMaterial = this._meshComponent.material.clone();
        this._meshComponent.material = this._meshMaterial;

        // Get the text component
        this._textComponent = this.textObject.getComponent('text');

        // Mark object as UI Element
        this.object.addComponent(TagComponent, {
            tag: Tag.UI
        });
    }

    public interact(): void
    {
        console.log("Button clicked: " + this.object.name);
        
        for (const interactCallback of this._interactCallbacks)
            interactCallback();

        if(this.visualFeedbackEnabled)
            this.processVisualFeedback();
    }

    private processVisualFeedback(): void
    {
        this._meshMaterial['color'] = [0.635, 0.730, 1, 1];
        setTimeout(() => {
            this._meshMaterial['color'] = [1, 1, 1, 1];
        }, 100);
    }
}