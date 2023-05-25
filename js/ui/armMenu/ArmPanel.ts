import {Component, MeshComponent, ComponentProperty, WonderlandEngine} from "@wonderlandengine/api";
import { vec3 } from "gl-matrix";
import { ObjectToggler } from "../../utils/ObjectToggler.js";


/**
 * Represent a panel on the arm menu. It doesn't contain any specific
 * panel's logic, only general purpose manipulations that are shared
 * between all panels.
 */
export class ArmPanel extends Component
{
    static TypeName: string = 'arm-panel';
    static Properties: Record<string, ComponentProperty> = { };

    // Fields
    private _objToggler: ObjectToggler;
    private _mesh: MeshComponent;

    public static onRegister(engine: WonderlandEngine): void
    {
        engine.registerComponent(ObjectToggler);
    }

    public override start(): void 
    {
        this._objToggler = this.object.addComponent(ObjectToggler);
        this._mesh = this.object.getComponent('mesh');

        // Reset object position
        this.object.setPositionLocal(vec3.fromValues(0, 0, 0));
    }

    /** Show the panel and enable all interactions */
    public show(): void 
    {
        this._objToggler.setActive(true);
    }

    /** Hide the panel and disable all interaction */
    public hide(): void 
    {
        this._objToggler.setActive(false);
    }
}