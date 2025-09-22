import {SoundEmitterBase} from '../SoundEmitterBase.js';
import {SoundEmitterType} from '../SoundEmitterType.js';

export class PlaceSoundEmitter extends SoundEmitterBase {
    static TypeName = 'sound-emitter-place';

    protected onInit(): void {
        this._emitterType = SoundEmitterType.BlockPlaced;
    }
}
