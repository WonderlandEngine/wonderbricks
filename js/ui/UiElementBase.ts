import {Component} from "@wonderlandengine/api";

export type UiInteractCallback = () => void;

/**
 * Base class for UI Elements components
 */
export default abstract class UiElementBase extends Component
{
    static TypeName = 'ui-element-base';
    static Properties = {};

    protected _interactCallbacks: Array<UiInteractCallback>;

    public override start()
    {
        this._interactCallbacks = new Array<UiInteractCallback>();
    }

    public addInteractCallback(callback: UiInteractCallback): void
    {
        this._interactCallbacks.push(callback);
    }

    public removeInteractCallback(callback: UiInteractCallback): void
    {
        const index = this._interactCallbacks.indexOf(callback);
        this._interactCallbacks.splice(index, 1);
    }

    public abstract interact(): void;
}
