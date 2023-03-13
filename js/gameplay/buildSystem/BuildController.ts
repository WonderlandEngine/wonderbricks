// Third party
import { Object } from "@wonderlandengine/api";
import { vec3, vec4 } from "gl-matrix";

// Prefabs
import PrefabsRegistry from "../prefabs/PrefabsRegistry";
import PrefabBase from "../prefabs/PrefabBase";
import { BlockSlopePrefab } from "../prefabs/BlockSlopePrefab";

// Others
import { BlockData } from "../serialization/SarielizationData";
import { BuildContainer } from "./BuildContainer";
import { TextureInformation } from "../../utils/textures/TextureInformation";


/**
 * This class control the building system and use prefabs
 * to operate as well as Texture Information to apply materials
 * on prefabs instances in the scene
 */
class BuildController
{
    private _buildContainer: Object;

    private _currentPrefab: PrefabBase;
    private _currentTexture: TextureInformation;
    private _currentColor: vec4;

    public constructor()
    {
        this._currentPrefab = null;
        this._currentColor = [1.0, 1.0, 1.0, 1.0] as vec4;

        // Temp
        this.test();
    }

    private async test(): Promise<void>
    {
        await new Promise(f => setTimeout(f, 1000));
        this._currentPrefab = PrefabsRegistry.getPrefab(BlockSlopePrefab);
        this._currentPrefab.updatePrevisColor(this._currentColor);
    }

    /**
     * Setters and initialisation
     * ==============================
     */

    public setBuildContainer(container: Object): void { this._buildContainer = container; }

    public setCurrentPrevizPosition(position: vec3): void { this._currentPrefab.updatePrevisPosition(position); }

    /**
     * Set the prefab that should be placed and shown as previs in the world
     * @param prefab the new prefab
     */
    public setPrefab(prefab: PrefabBase): void { this._currentPrefab = prefab; }

    /**
     * Set the color that should use the previsualisation mesh's material
     * @param color the new color of the previz
     */
    public setColor(color: vec4): void 
    {
        this._currentColor = color;
        this._currentPrefab.updatePrevisColor(this._currentColor);
    }

    /**
     * Set the current Texture information that will be used when a new block will be
     * placed in the world by the user.
     * @param texInfo the new texture to use on block creation in the world
     */
    public setTexture(texInfo: TextureInformation): void
    {
        this._currentTexture = texInfo;
    }

    /**
     * Previz and prefab control
     * ==============================
     */

    public addCurrentPrevizRotation(xRot: number, yRot: number): void 
    { 
        this._currentPrefab.updatePrevisRotation(xRot, yRot); 
    }

    public instanciatePrefabAt(position: vec3): void 
    { 
        this._currentPrefab.createBlock(position, this._currentTexture, this._buildContainer); 
    }

    /**
     * Save and Load
     * ==============================
     */

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