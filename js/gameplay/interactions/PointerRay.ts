import {Component, MeshComponent, Object, Scene, Type} from "@wonderlandengine/api";
import {quat, vec3, vec4} from "gl-matrix";
import {getCurrentScene} from "../../lib/WlApi";
import GridManager from "../grid/GridManager";


export default class PointerRay extends Component
{
    static TypeName = 'pointer-ray';
    static Properties = {
        rayObject: {type: Type.Object},
        rayVisualObject: {type: Type.Object},
        pointerObject: {type: Type.Object}
    }

    // Properties class declaration
    private rayObject: Object;
    private rayVisualObject: Object;
    private pointerObject: Object;

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

    public override start()
    {
        this._scene = getCurrentScene();

        this._rayMesh = this.rayVisualObject.getComponent('mesh');
        this._rayMesh.material["diffuseColor"] = vec4.create();

        this.rayVisualObject.translate([0,0,-0.5]);

        this._origin = [0,0,0];
        this._direction = [0,0,0];
    }

    public override update(delta: number)
    {
        this.rayObject.getTranslationWorld(this._origin);
        this.rayObject.getForward(this._direction);

        let hit = this._scene.rayCast(this._origin, this._direction, 1);
        if(hit.hitCount > 0)
        {
            this._currentCellIndices = GridManager.grid.getCellIndices(hit.locations[0][0], hit.locations[0][1], hit.locations[0][2]);
            this._currentCellWorldPos = GridManager.grid.getCellPositionVec3(this._currentCellIndices);

            this.pointerObject.setTranslationWorld(this._currentCellWorldPos);
        }
        else
        {
            this.pointerObject.setTranslationWorld([0,-5,0]);
        }
    }
}