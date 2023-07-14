// Third party
import { Object, Object3D } from "@wonderlandengine/api";
import { vec3, vec4 } from "gl-matrix";

// Prefabs
import PrefabsRegistry from "../prefabs/PrefabsRegistry.js";
import PrefabBase from "../prefabs/PrefabBase.js";

// Others
import { BlockData } from "../serialization/SarielizationData.js";
import { BuildContainer } from "./BuildContainer.js";
import { TextureInformation } from "../../utils/textures/TextureInformation.js";
import TextureInformationRegistry from "../../utils/textures/TextureInformationRegistry.js";
import { BlockPrefab } from "../prefabs/BlockPrefab.js";


/**
 * This class control the building system and use prefabs
 * to operate as well as Texture Information to apply materials
 * on prefabs instances in the scene
 */
class BuildController
{
    private _buildContainer: Object3D;

    private _currentPrefab: PrefabBase;
    private _currentTexture: TextureInformation;
    private _currentColor: vec4;

    public constructor()
    {
        this._currentPrefab = null;
        this._currentColor = [1.0, 1.0, 1.0, 1.0] as vec4;
    }

    /**
     * Setters and initialisation
     * ==============================
     */

    public setBuildContainer(container: Object): void { this._buildContainer = container; }

    public setCurrentPrevisPosition(position: vec3): void
    {
        if(this._currentPrefab == null)
            return;

        this._currentPrefab.updatePrevisPosition(position);
    }

    /**
     * Set the prefab that should be placed and shown as previs in the world
     * @param prefab the new prefab
     */
    public setPrefab(prefab: PrefabBase): void { this._currentPrefab = prefab; }

    /**
     * Set the color that should use the visualisation mesh's material
     * @param color the new color of the previs
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
     * Previs and prefab control
     * ==============================
     */

    public addCurrentPrevisRotation(xRot: number, yRot: number): void
    { 
        this._currentPrefab.updatePrevisRotation(xRot, yRot); 
    }

    public instantiatePrefabAt(position: vec3): void
    {
        if(this._currentPrefab == null)
            return;

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