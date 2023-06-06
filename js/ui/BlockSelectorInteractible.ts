import {Component, MeshComponent, Object, Property} from "@wonderlandengine/api";
import PrefabBase from "../gameplay/prefabs/PrefabBase";
import {UiButton} from "./UiButton";
import BuildController from "../gameplay/buildSystem/BuildController";
import PrefabsRegistry from "../gameplay/prefabs/PrefabsRegistry";
import { Color } from "../utils/materials/Color";
import { vec4 } from "gl-matrix";
import { BlockSelectionPanel } from "./armMenu/BlockSelectionPanel";


export class BlockSelectorInteractible extends Component
{
    static TypeName = 'block-selector-interactible';
    static Properties = {
        prefab: Property.object(),
        isDefaultBlock : Property.bool(false)
    }

    // Properties fields declaration
    private prefab: Object;
    private isDefaultBlock:Boolean;

    // fields
    private _prefabComponent: PrefabBase;
    private _buttonComponent: UiButton;
    private _mesh: MeshComponent;

    private _parent: BlockSelectionPanel;

    public override start()
    {
        this._prefabComponent = PrefabsRegistry.getPrefabByName(this.prefab[PrefabsRegistry.PREFAB_UNAME_KEY]);

        this._buttonComponent = this.object.getComponent(UiButton);
        this._buttonComponent.addInteractCallback(this.onInteractHandler.bind(this));

        this._mesh = this.object.getComponent('mesh');
        let material = this._mesh.material;
        this._mesh.material = material.clone();

        // Get parent BlockSelectionPanel component
        this._parent = this.object.parent.getComponent(BlockSelectionPanel);
        this._parent.registerButton(this);
        if(this.isDefaultBlock)
            this.onInteractHandler();
    }

    public override onActivate(): void 
    {
        this._prefabComponent = PrefabsRegistry.getPrefabByName(this.prefab[PrefabsRegistry.PREFAB_UNAME_KEY]);
    }

    public setVisualColor(color: vec4): void 
    {
        this._mesh.material['color'] = color;
    }

    private onInteractHandler(): void
    {
        BuildController.setPrefab(this._prefabComponent);
        this._parent.notifyInteraction(this);
    }
}
