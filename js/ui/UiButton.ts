import {MeshComponent, Object, TextComponent, Type} from '@wonderlandengine/api';
import {TagComponent} from '../utils/TagComponent.js';
import {Tag} from '../utils/Tag.js';
import {UiElementBase} from './UiElementBase.js';
import {Color} from '../utils/materials/Color.js';

export class UiButton extends UiElementBase {
    static TypeName = 'ui-button';
    static Properties = {
        textObject: {type: Type.Object},
        visualFeedbackEnabled: {type: Type.Bool, default: true},
    };

    // Properties declaration
    private textObject: Object;
    private visualFeedbackEnabled: boolean;

    // Class fields
    private _meshComponent: MeshComponent;
    private _textComponent: TextComponent;

    public start(): void {
        // Create a copy of the material instance
        this._meshComponent = this.object.getComponent('mesh');
        this._meshComponent.material = this._meshComponent.material.clone();

        // Get the text component
        if (this.textObject != null)
            this._textComponent = this.textObject.getComponent('text');

        // Mark object as UI Element
        this.object.addComponent(TagComponent, {
            tag: Tag.UI,
        });
    }

    public interact(): void {
        console.log('Button clicked: ' + this.object.name);

        for (const interactCallback of this._interactCallbacks) interactCallback();

        if (this.visualFeedbackEnabled) this.processVisualFeedback();
    }

    private processVisualFeedback(): void {
        this._meshComponent.material['color'] = Color.COLOR_TINT_ACTIVE;
        setTimeout(() => {
            this._meshComponent.material['color'] = Color.COLOR_TINT_NORMAL;
        }, 100);
    }
}
