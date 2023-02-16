/**
 * Since Wonderland Engine has no built-in tag system
 * this util static class simulate the integration of tag
 * support using key access to a property.
 */
import {Object} from "@wonderlandengine/api";
import {Tag} from "./Tag";


export default class TagUtils
{
    public static readonly tagKey: string = 'TAG';

    public static setTag(object: Object, tag: Tag): void
    {
        object[this.tagKey] = tag;
    }

    public static hasTag(object: Object, tag: Tag): boolean
    {
        return !(!object[this.tagKey] && object[this.tagKey] !== tag);
    }

    public static getTag(object: Object): Tag | undefined
    {
        return object[this.tagKey];
    }
}