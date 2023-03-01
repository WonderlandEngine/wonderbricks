import PrefabBase from "../prefabs/PrefabBase";
import {vec3, vec4} from "gl-matrix";
import PrefabsRegistry from "../prefabs/PrefabsRegistry";
import BlockSlopePrefab from "../prefabs/BlockSlopePrefab";
import {Object} from "@wonderlandengine/api";
import {BlockData} from "../serialization/SarielizationData";
import BuildContainer from "./BuildContainer";


class BuildController
{
    private _buildContainer: Object;
    private _currentPrefab: PrefabBase;
    private _currentColor: vec4;

    public constructor()
    {
        this._currentPrefab = null;
        this._currentColor = [0.2, 0.6, 0.86, 1] as vec4;

        // Temp
        this.test();
    }

    private async test(): Promise<void>
    {
        await new Promise(f => setTimeout(f, 1000));
        this._currentPrefab = PrefabsRegistry.getPrefab(BlockSlopePrefab);
        this._currentPrefab.updatePrevisColor(this._currentColor);
    }

    public setBuildContainer(container: Object): void { this._buildContainer = container; }

    public setCurrentPrevizPosition(position: vec3): void { this._currentPrefab.updatePrevisPosition(position);}

    public addCurrentPrevizRotation(xRot: number, yRot: number): void
    {
        this._currentPrefab.updatePrevisRotation(xRot, yRot);
    }

    public instanciatePrefabAt(position: vec3): void
    {
        this._currentPrefab.createBlock(position, this._currentColor, this._buildContainer);
    }

    public setPrefab(prefab: PrefabBase): void { this._currentPrefab = prefab; }

    public setColor(color: vec4): void
    {
        this._currentColor = color;
        this._currentPrefab.updatePrevisColor(this._currentColor);
    }

    public getCurrentBuildData(): Array<BlockData>
    {
        return this._buildContainer.getComponent(BuildContainer).generateBuildData();
    }

    public loadBuild(data: Array<BlockData>): void
    {
        this._buildContainer.getComponent(BuildContainer).loadBuildData(data);
    }
}

export default new BuildController();