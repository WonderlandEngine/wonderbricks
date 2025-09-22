import {Object, Component, ComponentProperty} from '@wonderlandengine/api';
import {ArmPanel} from '../ui/armMenu/ArmPanel.js';

export class ObjectToggler extends Component {
    static TypeName: string = 'object-toggler';
    static Properties: Record<string, ComponentProperty> = {};

    // Fields
    private _components: Array<Component>;

    public override start(): void {
        this._components = new Array<Component>();
        this.fetchAllComponents(this.object);
    }

    /**
     * Enable or disable all components from the owner and its
     * children (all the hierarchy is affected by the process)
     * @param active
     */
    public setActive(active: boolean): void {
        for (let i = 0; i < this._components.length; i++) {
            this._components[i].active = active;
        }
    }

    /**
     * This method fetch all components for the given object and
     * store them into an array.
     * This array is then use to enable/disable all components in order
     * to reproduce a enable/disable behaviour on the object
     * @param object object to extract components ref
     */
    private fetchAllComponents(object: Object): void {
        const objComponents = object
            .getComponents(null)
            .filter((e) => e.type !== ArmPanel.TypeName);

        this._components = this._components.concat(objComponents);

        const children = object.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            this.fetchAllComponents(child);
        }
    }
}
