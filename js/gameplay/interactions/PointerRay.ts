import {Component, MeshComponent, Object, Scene, Type} from "@wonderlandengine/api";
import {quat, vec3, vec4} from "gl-matrix";
import {getCurrentScene} from "../../lib/WlApi";
import GridManager from "../grid/GridManager";
import PrefabBase from "../prefabs/PrefabBase";
import PrefabsRegistry from "../prefabs/PrefabsRegistry";
import BlockPrefab from "../prefabs/BlockPrefab";


export default class PointerRay extends Component
{
    static TypeName = 'pointer-ray';
    static Properties = {
        rayOrigin: {type: Type.Object},
        rayObject: {type: Type.Object},
        rayVisualObject: {type: Type.Object},
        cursorHitVisualObject: {type: Type.Object},
    }

    // Properties class declaration
    private rayOrigin: Object;
    private rayObject: Object;
    private rayVisualObject: Object;
    private cursorHitVisualObject: Object;
    private pointerObject: PrefabBase;

    // Scene elements
    private _scene: Scene;
    private _rayMesh: MeshComponent;

    // Physic Raycast fields
    private _origin: Array<number>;
    private _direction: Array<number>;

    // Current cell information
    private _currentCellIndices: vec3;
    private _currentCellWorldPos: vec3;

    // Getters
    public get currentCellIndices() { return this._currentCellIndices; }
    public get currentCellWorldPos() { return this._currentCellWorldPos; }
    public get currentPrefab() { return this.pointerObject; }

    public override start()
    {
        this._scene = getCurrentScene();
        setTimeout(() => { this.pointerObject = PrefabsRegistry.getPrefab(BlockPrefab); }, 1000);

        this._rayMesh = this.rayVisualObject.getComponent('mesh');
        this._rayMesh.material["diffuseColor"] = vec4.create();

        this.rayVisualObject.translate([0,0,-0.5]);

        this._origin = [0,0,0];
        this._direction = [0,0,0];
    }

    public override update(delta: number)
    {
        this.rayOrigin.getTranslationWorld(this._origin);
        this.rayOrigin.getForward(this._direction);

        let hit = this._scene.rayCast(this._origin, this._direction, 1);
        if(hit.hitCount > 0)
        {
            let hitLocation = hit.locations[0];

            this.processRayStretch(hitLocation);
            this.cursorHitVisualObject.setTranslationWorld(hitLocation);

            this._currentCellIndices = GridManager.grid.getCellIndices(hitLocation[0], hitLocation[1], hitLocation[2]);
            this._currentCellWorldPos = GridManager.grid.getCellPositionVec3(this._currentCellIndices);

            this.pointerObject.updatePrevisPosition(this._currentCellWorldPos);
        }
        else
        {
            this.rayObject.resetScaling();

            this.pointerObject.updatePrevisPosition([0,-5,0]);
            this.cursorHitVisualObject.setTranslationWorld([0,-5,0]);
        }
    }

    private processRayStretch(hitPosition: vec3): void
    {
        let rayPos: vec3 = vec3.create();
        rayPos[0] = this._origin[0];
        rayPos[1] = this._origin[1];
        rayPos[2] = this._origin[2];

        let distance = vec3.distance(rayPos, hitPosition);

        this.rayObject.resetScaling();
        this.rayObject.scale([1, distance - 0.2, 1]);
    }
}