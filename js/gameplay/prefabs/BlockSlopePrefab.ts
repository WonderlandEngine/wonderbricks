import {Object, Type} from "@wonderlandengine/api";
import PrefabBase from "./PrefabBase";
import PrefabsRegistry from "./PrefabsRegistry";


export default class BlockSlopePrefab extends PrefabBase
{
    static TypeName = 'block-slope-prefab';
    static Properties = {
        finalMesh: {type: Type.Mesh},
        previsMesh: {type: Type.Mesh},

        finalMat: {type: Type.Material},
        previsMat: {type: Type.Material},
    };

    public override getPrefabUniqueName(): string { return BlockSlopePrefab.TypeName; }

    public override start()
    {
        super.start();
        PrefabsRegistry.registerPrefab(this);

        this.createPrevisObject();
    }
}