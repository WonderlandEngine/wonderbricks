import {Collider, Component, Material, Mesh, Object, Scene, Type} from "@wonderlandengine/api";
import {Constructor, CustomParameter} from "@wonderlandengine/api/wonderland";
import {vec3} from "gl-matrix";
import {getCurrentScene} from "../../lib/WlApi";
import GridManager from "../grid/GridManager";

export type PrefabBaseConstructor<T extends PrefabBase> = Constructor<T> & {
    TypeName: string;
    Properties: Record<string, CustomParameter>;
};

export default abstract class PrefabBase extends Component
{
    static TypeName = '';
    static Properties = {
        finalMesh: {type: Type.Mesh},
        previsMesh: {type: Type.Mesh},

        finalMat: {type: Type.Material},
        previsMat: {type: Type.Material},
    };

    // Properties declarations
    protected finalMesh: Mesh;
    protected previsMesh: Mesh;
    protected finalMat: Material;
    protected previsMat: Material;

    // Scene information
    protected _scene: Scene;
    protected _cellSize: number;
    protected _previsObject: Object;

    public override start(): void
    {
        // Get Scene information
        this._scene = getCurrentScene();
        this._cellSize = GridManager.grid.cellSize;
    }

    public abstract getPrefabUniqueName(): string;

    protected createPrevisObject(): void
    {
        // Create previs object
        this._previsObject = this._scene.addObject(this.object);
        this._previsObject.translateWorld([0, 0, 0]);

        // Create previs visual object
        let previsVisual = this._scene.addObject(this._previsObject);
        previsVisual.translateObject([0, this._cellSize / 2.0, 0])
        previsVisual.addComponent('mesh', {
            mesh: this.previsMesh,
            material: this.previsMat
        });
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