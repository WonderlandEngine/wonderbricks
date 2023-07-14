import {Component, Object3D} from "@wonderlandengine/api";
import {property} from '@wonderlandengine/api/decorators.js';
import {vec3, quat} from "gl-matrix";

const tempquat = quat.create();
const tempVec = vec3.create();
const tempSliderVec = vec3.create();
const tempTargetVec = vec3.create();
const tempSliderQuat = quat.create();
const tempTargetQuat = quat.create();

/**
 * lerp
 */
export class Lerp extends Component {
    static TypeName = "lerp";

    /* Properties that are configurable in the editor */
    
    @property.object()
    hoverReference: Object3D | null = null;

    @property.object()
    falseParent: Object3D | null = null;
    
    @property.float()
    lerpSpeed: number = 0.02;


    start(): void 
    {
        this.object.parent = this.falseParent;
    }

    update() 
    {
        this.lerp(this.object, this.hoverReference, this.lerpSpeed);
    }

    lerp(slider: Object3D, target: Object3D, value: number) 
    {
        /** for translation **/
        /** lerp the slider position to the target position **/
        vec3.lerp(tempVec, slider.getPositionWorld(tempSliderVec), target.getPositionWorld(tempTargetVec), value);
        /** assign the lerp result to the slider **/
        slider.setPositionWorld(tempVec);

        /** for rotation **/
        /** lerp the slider position to the target position **/
        quat.lerp(tempquat, slider.getRotationWorld(tempSliderQuat), target.getRotationWorld(tempTargetQuat), value);
        /** assign the lerp result to the slider **/
        slider.setRotationWorld(tempquat);
    }
}
