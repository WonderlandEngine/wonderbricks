import { Component, CustomParameter, MeshComponent, Object } from "@wonderlandengine/api";
import { ObjectToggler } from "../../utils/ObjectToggler";


/**
 * Represent a panel on the arm menu. It doesn't contain any specific
 * panel's logic, only general purpose manipulations that are shared
 * between all panels.
 */
export class ArmPanel extends Component
{
    static TypeName: string = 'arm-panel';
    static Properties: Record<string, CustomParameter> = { };

    // Fields
    private _objToggler: ObjectToggler;
    private _mesh: MeshComponent;

    public override start(): void 
    {
        this._objToggler = this.object.addComponent(ObjectToggler);
        this._mesh = this.object.getComponent('mesh');
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