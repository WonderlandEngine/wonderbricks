import {Type} from '@wonderlandengine/api';
import PrefabBase from './PrefabBase.js';
import PrefabsRegistry from './PrefabsRegistry.js';

export class ConePrefab extends PrefabBase {
    static TypeName = 'cone-prefab';
    static Properties = {
        finalMesh: {type: Type.Mesh},
        previsMesh: {type: Type.Mesh},

        finalMat: {type: Type.Material},
        previsMat: {type: Type.Material},
    };

    public override getPrefabUniqueName(): string {
        return ConePrefab.TypeName;
    }

    public override start() {
        super.start();
        PrefabsRegistry.registerPrefab(this);

        this.createPrevisObject();
    }
}
