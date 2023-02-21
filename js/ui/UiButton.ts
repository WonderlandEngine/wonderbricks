import {Component, Object, TextComponent, Type} from "@wonderlandengine/api";
import TagComponent from "../utils/TagComponent";
import {Tag} from "../utils/Tag";


export default class UiButton extends Component
{
    static TypeName = 'ui-button';
    static Properties = {
        textObject: {type: Type.Object},
    }

    // Properties declaration
    private textObject: Object;

    // Class fields
    private textComponent: TextComponent;

    public start(): void
    {
        // Mark object as UI Element
        this.object.addComponent(TagComponent, {
            tag: Tag.UI
        });
    }

    public click(): void
    {
        console.log("Button clicked: " + this.object.name);
    }
}