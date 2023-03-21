import {Type} from "@wonderlandengine/api";
import PrefabBase from "./PrefabBase";
import PrefabsRegistry from "./PrefabsRegistry";


export class CylinderPrefab extends PrefabBase
{
    static TypeName = 'cylinder-prefab';
    static Properties = {
        finalMesh: {type: Type.Mesh},
        previsMesh: {type: Type.Mesh},

        finalMat: {type: Type.Material},
        previsMat: {type: Type.Material},
    };

    public override getPrefabUniqueName(): string { return CylinderPrefab.TypeName; }

    public override start()
    {
        super.start();
        PrefabsRegistry.registerPrefab(this);

        this.createPrevisObject();
    }
}