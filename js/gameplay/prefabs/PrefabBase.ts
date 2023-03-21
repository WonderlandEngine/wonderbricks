import { Collider, Component, Material, Mesh, Object, Scene, Type } from "@wonderlandengine/api";
import { Constructor, CustomParameter } from "@wonderlandengine/api/wonderland";
import { quat, vec3, vec4 } from "gl-matrix";
import { getCurrentScene } from "../../lib/WlApi";
import GridManager from "../grid/GridManager";
import { TagComponent } from "../../utils/TagComponent";
import { Tag } from "../../utils/Tag";
import PrefabsRegistry from "./PrefabsRegistry";
import { PhysicalMaterial } from "../../utils/materials/PhysicalMaterial";
import { TextureInformation } from "../../utils/textures/TextureInformation";

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
        this._previsObject = this._scene.addObject(null);
        this._previsObject.translateWorld([0, -5.0, 0]);

        // Create previs visual object
        let previsVisual = this._scene.addObject(this._previsObject);
        previsVisual.translateObject([0, this._cellSize / 2.0, 0]);
        previsVisual.addComponent('mesh', {
            mesh: this.previsMesh,
            material: this.previsMat
        });
    }

    /**
     * Create the block in the scene at the specified world
     * position
     * @param position
     * @param color
     * @param container
     */
    public createBlock(position: vec3, texInfo: TextureInformation, container: Object): Object
    {
        let newBlock = this._scene.addObject(container);
        newBlock[PrefabsRegistry.PREFAB_UNAME_KEY] = this.getPrefabUniqueName();
        newBlock[PrefabsRegistry.PREFAB_TNAME_KEY] = texInfo.uniqueID;

        newBlock.translateWorld(position);
 
        // Create visual object
        let finalVisual = this._scene.addObject(newBlock);
        finalVisual.resetTransform();
        finalVisual.translateObject([0, this._cellSize / 2.0, 0]);
        finalVisual.rotationWorld = this._previsObject.rotationWorld;

        // Setup Material
        let mat: PhysicalMaterial = this.finalMat.clone() as PhysicalMaterial;

        // Set textures based on current Texture Information
        mat.albedoTexture = texInfo.albedoTexture;
        mat.normalTexture = texInfo.normalTexture;

        // Apply the material to the mesh
        finalVisual.addComponent('mesh', {
            mesh: this.finalMesh,
            material: mat
        });

        finalVisual.addComponent(TagComponent, {
            tag: Tag.BLOCK
        });

        let extents = (this._cellSize / 2.0) + 0.001;
        finalVisual.addComponent('collision', {
            collider: Collider.AxisAlignedBox,
            extents: [extents, extents, extents],
            group: 1,
        });

        return newBlock;
    }

    /**
     * Update the world position of the previs visual
     * @param position
     */
    public updatePrevisPosition(position: vec3): void
    {
        this._previsObject.setTranslationWorld(position);
        let pos: vec3 = vec3.create();
        this._previsObject.getTranslationWorld(pos);
    }

    public updatePrevisRotation(xRot: number, yRot: number): void
    {
        this._previsObject.rotateAxisAngleDeg([1,0,0], xRot);
        this._previsObject.rotateAxisAngleDeg([0,1,0], yRot);
    }

    public setPrevisRotation(rotation: quat): void
    {
        this._previsObject.resetRotation();
        this._previsObject.rotationWorld = rotation;
    }

    public updatePrevisColor(color: vec4): void
    {
        this.previsMat['diffuseColor'] = color;
    }
}