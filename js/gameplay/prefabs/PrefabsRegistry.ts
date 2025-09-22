import PrefabBase, {PrefabBaseConstructor} from './PrefabBase.js';
import {Object} from '@wonderlandengine/api';

class PrefabsRegistry {
    private _prefabs: Map<string, PrefabBase>;

    public readonly PREFAB_UNAME_KEY = 'pun';
    public readonly PREFAB_TNAME_KEY = 'texName';

    public constructor() {
        this._prefabs = new Map<string, PrefabBase>();
    }

    public registerPrefab<T extends PrefabBase>(prefab: T): void {
        let prefabUniqueName = prefab.getPrefabUniqueName();

        if (this._prefabs.has(prefabUniqueName))
            throw new Error("Can't register the same prefab twice: " + prefabUniqueName);

        this._prefabs.set(prefabUniqueName, prefab);
        prefab.object[this.PREFAB_UNAME_KEY] = prefabUniqueName;
    }

    public getPrefab<T extends PrefabBase>(
        typeOrClass: PrefabBaseConstructor<T>
    ): T | null {
        if (this._prefabs.has(typeOrClass.TypeName))
            return this._prefabs.get(typeOrClass.TypeName) as T;

        return null;
    }

    public getPrefabByName(uName: string): PrefabBase {
        if (this._prefabs.has(uName)) return this._prefabs.get(uName);

        return null;
    }

    public removePrefab<T extends PrefabBase>(typeOrClass: PrefabBaseConstructor<T>): void {
        if (!this._prefabs.has(typeOrClass.TypeName)) return;

        this._prefabs.delete(typeOrClass.TypeName);
    }
}

export default new PrefabsRegistry();
