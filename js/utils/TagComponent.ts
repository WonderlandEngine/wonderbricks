import {Component, Type} from "@wonderlandengine/api";
import {Tag} from "./Tag";
import TagUtils from "./TagUtils";

/**
 * The only goal of this component is to set the object's tag
 * on start.
 */
export default class TagComponent extends Component
{
    static TypeName = 'tag-component';
    static Properties = {
        tag: {
            type: Type.Enum,
            values: [
                Tag.ENVIRONMENT.toString(),
                Tag.UI.toString()
            ]
        }
    }

    private tag: string;

    public override start()
    {
        TagUtils.setTag(this.object, parseInt(this.tag));
    }
}