import SoundEmitterBase from "../SoundEmitterBase";
import {SoundEmitterType} from "../SoundEmitterType";


export default class DestroySoundEmitter extends SoundEmitterBase
{
    static TypeName = 'sound-emitter-destroy';

    protected onInit(): void
    {
        this._emitterType = SoundEmitterType.BlockDestroy;
    }
}