import {Collider, Component, Material, Mesh, Object, Scene, Type} from "@wonderlandengine/api";
import {getCurrentScene} from "../../lib/WlApi";
import GridManager from "../grid/GridManager";
import {vec3} from "gl-matrix";
import PrefabBase from "./PrefabBase";
import PrefabsRegistry from "./PrefabsRegistry";


export default class BlockPrefab extends PrefabBase
{
    static TypeName = 'block-prefab';
    static Properties = {
        finalMesh: {type: Type.Mesh},
        previsMesh: {type: Type.Mesh},

        finalMat: {type: Type.Material},
        previsMat: {type: Type.Material},
    };

    // Properties declarations
    private finalMesh: Mesh;
    private previsMesh: Mesh;
    private finalMat: Material;
    private previsMat: Material;

    // Scene information
    private _scene: Scene;
    private _cellSize: number;

    private _previsObject: Object;

    public override getPrefabUniqueName(): string { return BlockPrefab.TypeName; }

    public override start()
    {
        PrefabsRegistry.registerPrefab(this);

        // Get Scene information
        this._scene = getCurrentScene();
        this._cellSize = GridManager.grid.cellSize;

        // Create previs object
        this._previsObject = this._scene.addObject(this.object);
        this._previsObject.translateWorld([0, -5.0, 0]);

        // Create previs visual object
        let previsVisual = this._scene.addObject(this._previsObject);
        previsVisual.translateObject([0, this._cellSize / 2.0, 0])
        previsVisual.addComponent('mesh', {
            mesh: this.previsMesh,
            material: this.previsMat
        });

        this.createBlock([0,0,0]);
    }

    /**
     * Create the block in the scene at the specified world
     * position
     * @param position
     */
    public createBlock(position: vec3): Object
    {
        let newBlock = this._scene.addObject(null);
        newBlock.translateWorld(position);

        // Create visual object
        let finalVisual = this._scene.addObject(newBlock);
        finalVisual.translateObject([0, this._cellSize / 2.0, 0])
        finalVisual.addComponent('mesh', {
            mesh: this.finalMesh,
            material: this.finalMat
        });

        let extents = this._cellSize / 2.0;
        finalVisual.addComponent('collision', {
            collider: Collider.AxisAlignedBox,
            extents: [extents, extents, extents]
        });

        return newBlock;
    }
}