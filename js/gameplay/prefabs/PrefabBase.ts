import {
    Collider,
    Component,
    Material,
    Mesh,
    Object3D as Object,
    Type,
} from '@wonderlandengine/api';
import {Constructor, ComponentProperty} from '@wonderlandengine/api';
import {quat, vec3, vec4} from 'gl-matrix';
import {getCurrentScene} from '../../lib/WlApi.js';
import GridManager from '../grid/GridManager.js';
import {TagComponent} from '../../utils/TagComponent.js';
import {Tag} from '../../utils/Tag.js';
import PrefabsRegistry from './PrefabsRegistry.js';
import {PhysicalMaterial} from '../../utils/materials/PhysicalMaterial.js';
import {TextureInformation} from '../../utils/textures/TextureInformation.js';

const TEMP_QUAT = quat.create();

export type PrefabBaseConstructor<T extends PrefabBase> = Constructor<T> & {
    TypeName: string;
    Properties: Record<string, ComponentProperty>;
};

export default abstract class PrefabBase extends Component {
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
    protected _cellSize: number;
    protected _previsObject: Object;

    public override start(): void {
        // Get Scene information
        this._cellSize = GridManager.grid.cellSize;
    }

    public abstract getPrefabUniqueName(): string;

    protected createPrevisObject(): void {
        // Create previs object
        this._previsObject = this.scene.addObject(null);
        this._previsObject.translateWorld([0, -5.0, 0]);

        // Create previs visual object
        let previsVisual = this.scene.addObject(this._previsObject);
        previsVisual.translateObject([0, this._cellSize / 2.0, 0]);
        previsVisual.addComponent('mesh', {
            mesh: this.previsMesh,
            material: this.previsMat,
        });
    }

    /**
     * Create the block in the scene at the specified world
     * position
     * @param position
     * @param texInfo
     * @param container
     */
    public createBlock(
        position: vec3,
        texInfo: TextureInformation,
        container: Object
    ): [Object, PhysicalMaterial] {
        let newBlock = this.scene.addObject(container);
        newBlock[PrefabsRegistry.PREFAB_UNAME_KEY] = this.getPrefabUniqueName();
        newBlock[PrefabsRegistry.PREFAB_TNAME_KEY] = texInfo.uniqueID;

        newBlock.translateWorld(position);

        // Create visual object
        let finalVisual = this.scene.addObject(newBlock);
        finalVisual.resetTransform();
        finalVisual.translateObject([0, this._cellSize / 2.0, 0]);
        this._previsObject.getRotationWorld(TEMP_QUAT);
        finalVisual.setRotationWorld(TEMP_QUAT);

        // Setup Material
        let mat: PhysicalMaterial = this.finalMat.clone() as PhysicalMaterial;

        // Set textures based on current Texture Information
        mat.albedoTexture = texInfo.albedoTexture;
        mat.normalTexture = texInfo.normalTexture;

        // Apply the material to the mesh
        finalVisual.addComponent('mesh', {
            mesh: this.finalMesh,
            material: mat,
        });

        finalVisual.addComponent(TagComponent, {
            tag: Tag.BLOCK,
        });

        let extents = this._cellSize / 2.0 + 0.001;
        finalVisual.addComponent('collision', {
            collider: Collider.AxisAlignedBox,
            extents: [extents, extents, extents],
            group: (1 << 1) | (1 << 2),
        });

        return [newBlock, mat];
    }

    /**
     * Update the world position of the previs visual
     * @param position
     */
    public updatePrevisPosition(position: vec3): void {
        this._previsObject.setPositionWorld(position);
        let pos: vec3 = vec3.create();
        this._previsObject.getPositionWorld(pos);
    }

    public updatePrevisRotation(xRot: number, yRot: number): void {
        this._previsObject.rotateAxisAngleDegLocal([1, 0, 0], xRot);
        this._previsObject.rotateAxisAngleDegLocal([0, 1, 0], yRot);
    }

    public setPrevisRotation(rotation: quat): void {
        this._previsObject.resetRotation();
        this._previsObject.setRotationWorld(rotation);
    }

    public updatePrevisColor(color: vec4): void {
        this.previsMat['albedoColor'] = color;
    }
}
