import { SoundEmitterBase } from "../SoundEmitterBase";
import { SoundEmitterType } from "../SoundEmitterType";


export class RotateSoundEmitter extends SoundEmitterBase
{
    static TypeName = 'sound-emitter-rotate';

    protected onInit(): void
    {
        this._emitterType = SoundEmitterType.BlockRotate;
    }
}