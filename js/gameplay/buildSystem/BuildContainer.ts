import {Component, Object} from "@wonderlandengine/api";
import BuildController from "./BuildController";
import { BlockData } from "../serialization/SarielizationData";
import PrefabsRegistry from "../prefabs/PrefabsRegistry";
import {vec3, vec4} from "gl-matrix";
import PrefabBase from "../prefabs/PrefabBase";


export default class BuildContainer extends Component
{
    static TypeName = 'build-container';
    static Properties = {};

    private tempTime: number = 0;

    public override init()
    {
        // Auto reference as build container to build controller
        BuildController.setBuildContainer(this.object);
    }

    public generateBuildData(): Array<BlockData>
    {
        let data = new Array<BlockData>();

        console.log(this.object.children);

        for (const child of this.object.children)
        {
            let visual = child.children[0];

            let meshComponent = visual.getComponent('mesh');
            let position: vec3 = vec3.create();
            child.getTranslationWorld(position);

            // Create a new element to prevent reference passing
            let color = meshComponent.material['diffuseColor'];
            let finalColor = vec4.fromValues(color[0], color[1], color[2], color[3]);

            data.push({
                type: child[PrefabsRegistry.PREFAB_UNAME_KEY],
                color: finalColor,
                position: position,
                rotation: visual.rotationWorld
            });
        }

        return data;
    }

    public loadBuildData(data: Array<BlockData>): void
    {
        let currentPrefab: PrefabBase;
        for (const block of data)
        {
            currentPrefab = PrefabsRegistry.getPrefabByName(block.type);
            currentPrefab.setPrevisRotation(block.rotation);

            BuildController.setPrefab(currentPrefab);
            const color = new Float32Array([block.color[0], block.color[1], block.color[2], block.color[3]]);
            BuildController.setColor(color);

            BuildController.instanciatePrefabAt(block.position);
        }
    }
}