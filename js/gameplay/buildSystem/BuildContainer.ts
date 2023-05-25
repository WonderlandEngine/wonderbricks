import {Component} from "@wonderlandengine/api";
import BuildController from "./BuildController";
import { BlockData } from "../serialization/SarielizationData";
import PrefabsRegistry from "../prefabs/PrefabsRegistry";
import {quat, vec3, vec4} from "gl-matrix";
import PrefabBase from "../prefabs/PrefabBase";
import TextureInformationRegistry from "../../utils/textures/TextureInformationRegistry";


export class BuildContainer extends Component
{
    static TypeName = 'build-container';
    static Properties = {};

    public override init()
    {
        // Auto reference as build container to build controller
        BuildController.setBuildContainer(this.object);
    }

    public generateBuildData(): Array<BlockData>
    {
        let data = new Array<BlockData>();

        const children = this.object.children;
        for (const child of children)
        {
            let visual = child.children[0];
            let position: vec3 = vec3.create();
            child.getTranslationWorld(position);

            data.push({
                type: child[PrefabsRegistry.PREFAB_UNAME_KEY],
                texture: child[PrefabsRegistry.PREFAB_TNAME_KEY],
                position: position,
                rotation: visual.rotationWorld
            });
        }

        return data;
    }

    public loadBuildData(data: Array<BlockData>): void
    {
        this.clearBlocksInScene();

        let currentPrefab: PrefabBase;
        for (const block of data)
        {
            currentPrefab = PrefabsRegistry.getPrefabByName(block.type);

            const rot = block.rotation;
            currentPrefab.setPrevisRotation(quat.fromValues(rot[0], rot[1], rot[2], rot[3]));

            BuildController.setPrefab(currentPrefab);

            const currentTexture = TextureInformationRegistry.getTextureInformation(block.texture);
            BuildController.setTexture(currentTexture);

            BuildController.instantiatePrefabAt(block.position);
        }
    }

    public clearBlocksInScene(): void
    {
        for (const child of this.object.children)
        {
            child.destroy();
        }
    }
}