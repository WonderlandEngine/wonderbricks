import {Component, Object, Type} from "@wonderlandengine/api";
import PrefabBase from "../gameplay/prefabs/PrefabBase";
import UiButton from "./UiButton";
import BuildController from "../gameplay/buildSystem/BuildController";
import PrefabsRegistry from "../gameplay/prefabs/PrefabsRegistry";


export default class BlockSelectorInteractible extends Component
{
    static TypeName = 'block-selector-interactible';
    static Properties = {
        prefab: {type: Type.Object}
    }

    // Properties fields declaration
    private prefab: Object;

    // fields
    private _prefabComponent: PrefabBase;
    private _buttonComponent: UiButton;

    public override start()
    {
        this._prefabComponent = PrefabsRegistry.getPrefabByName(this.prefab[PrefabsRegistry.PREFAB_UNAME_KEY]);

        this._buttonComponent = this.object.getComponent(UiButton);
        this._buttonComponent.addInteractCallback(this.onInteractHandler.bind(this));
    }

    private onInteractHandler(): void
    {
        BuildController.setPrefab(this._prefabComponent);
    }
}