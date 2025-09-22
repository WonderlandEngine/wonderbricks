import {Type} from '@wonderlandengine/api';
import PrefabBase from './PrefabBase.js';
import PrefabsRegistry from './PrefabsRegistry.js';

export class BlockVerticalPrefab extends PrefabBase {
    static TypeName = 'block-vertical-prefab';
    static Properties = {
        finalMesh: {type: Type.Mesh},
        previsMesh: {type: Type.Mesh},

        finalMat: {type: Type.Material},
        previsMat: {type: Type.Material},
    };

    public override getPrefabUniqueName(): string {
        return BlockVerticalPrefab.TypeName;
    }

    public override start() {
        super.start();
        PrefabsRegistry.registerPrefab(this);

        this.createPrevisObject();
    }
}
