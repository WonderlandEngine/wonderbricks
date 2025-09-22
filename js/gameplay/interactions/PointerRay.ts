import {Component, MeshComponent, Object3D as Object, Type} from '@wonderlandengine/api';
import {vec3, vec4} from 'gl-matrix';
import {getCurrentScene} from '../../lib/WlApi.js';

export class PointerRay extends Component {
    static TypeName = 'pointer-ray';
    static Properties = {
        rayOrigin: {type: Type.Object},
        rayObject: {type: Type.Object},
        rayVisualObject: {type: Type.Object},
        cursorHitVisualObject: {type: Type.Object},
    };

    // Properties class declaration
    private rayOrigin: Object;
    private rayObject: Object;
    private rayVisualObject: Object;
    private cursorHitVisualObject: Object;

    // Scene elements
    private _rayMesh: MeshComponent;

    // Physic Ray cast fields
    private _origin: Array<number>;
    private _direction: Array<number>;

    // current information
    private _isPointing: boolean;
    private _currentHitPosition: vec3;
    private _currentHitObject: Object;

    // Getters
    public get isPointing() {
        return this._isPointing;
    }
    public get currentHitPosition() {
        return this._currentHitPosition;
    }
    public get currentHitObject() {
        return this._currentHitObject;
    }

    public override start() {
        this._rayMesh = this.rayVisualObject.getComponent('mesh');
        this._rayMesh.material['diffuseColor'] = vec4.create();

        this.rayVisualObject.translateLocal([0, 0, -0.5]);

        this._origin = [0, 0, 0];
        this._direction = [0, 0, 0];
    }

    public override update(delta: number) {
        this.rayOrigin.getPositionWorld(this._origin);
        this.rayOrigin.getForwardWorld(this._direction);

        const hit = this.engine.scene.rayCast(
            this._origin,
            this._direction,
            (1 << 1) | (1 << 2)
        );
        if (hit.hitCount > 0) {
            this._isPointing = true;
            this._currentHitPosition = vec3.clone(hit.locations[0]);
            this._currentHitObject = hit.objects[0];

            this.processRayStretch();
            this.cursorHitVisualObject.setPositionWorld(this._currentHitPosition);
        } else {
            this._isPointing = false;
            this.rayObject.resetScaling();
            this.cursorHitVisualObject.setPositionWorld([0, -5, 0]);
        }
    }

    private processRayStretch(): void {
        let rayPos: vec3 = vec3.create();
        rayPos[0] = this._origin[0];
        rayPos[1] = this._origin[1];
        rayPos[2] = this._origin[2];

        let distance = vec3.distance(rayPos, this._currentHitPosition);

        this.rayObject.resetScaling();
        this.rayObject.scaleLocal([1, distance - 0.05, 1]);
    }
}
