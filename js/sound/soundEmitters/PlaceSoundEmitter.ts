import { SoundEmitterBase } from "../SoundEmitterBase";
import { SoundEmitterType } from "../SoundEmitterType";


export class PlaceSoundEmitter extends SoundEmitterBase
{
    static TypeName = 'sound-emitter-place';

    protected onInit(): void
    {
        this._emitterType = SoundEmitterType.BlockPlaced;
    }
}