import PrefabBase from "../prefabs/PrefabBase";
import {vec3} from "gl-matrix";
import PrefabsRegistry from "../prefabs/PrefabsRegistry";
import BlockPrefab from "../prefabs/BlockPrefab";
import BlockSlopePrefab from "../prefabs/BlockSlopePrefab";


class BuildController
{
    private _currentPrefab: PrefabBase;
    private _currentColor: Float32Array;

    public constructor()
    {
        this._currentPrefab = null;
        this._currentColor = new Float32Array([1,1,1,1]);

        // Temp
        this.test();
    }

    private async test(): Promise<void>
    {
        await new Promise(f => setTimeout(f, 1000));
        this._currentPrefab = PrefabsRegistry.getPrefab(BlockSlopePrefab);
    }

    public setCurrentPrevizPosition(position: vec3): void
    {
        this._currentPrefab.updatePrevisPosition(position);
    }

    public addCurrentPrevizRotation(xRot: number, yRot: number): void
    {
        this._currentPrefab.updatePrevisRotation(xRot, yRot);
    }

    public instanciatePrefabAt(position: vec3): void
    {
        this._currentPrefab.createBlock(position, this._currentColor);
    }

    public setPrefab(prefab: PrefabBase): void
    {
        this._currentPrefab = prefab;
    }

    public setColor(color: Float32Array): void
    {
        this._currentColor = color;
        this._currentPrefab.updatePrevisColor(this._currentColor);
    }
}

export default new BuildController();