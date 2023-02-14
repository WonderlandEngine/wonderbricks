import PrefabBase, {PrefabBaseConstructor} from "./PrefabBase";


class PrefabsRegistry
{
    private _prefabs: Map<string, PrefabBase>;

    public constructor()
    {
        this._prefabs = new Map<string, PrefabBase>();
    }

    public registerPrefab<T extends PrefabBase>(prefab: T): void
    {
        let prefabUniqueName = prefab.getPrefabUniqueName();

        if(this._prefabs.has(prefabUniqueName))
            throw new Error("Can't register the same prefab twice: " + prefabUniqueName);

        this._prefabs.set(prefabUniqueName, prefab);
    }

    public getPrefab<T extends PrefabBase>(typeOrClass: PrefabBaseConstructor<T>): T | null
    {
        if(this._prefabs.has(typeOrClass.TypeName))
            return this._prefabs.get(typeOrClass.TypeName) as T;

        return null;
    }

    public removePrefab<T extends PrefabBase>(typeOrClass: T): void
    {

    }
}

export default new PrefabsRegistry();