import {SoundEmitterBase} from '../SoundEmitterBase.js';
import {SoundEmitterType} from '../SoundEmitterType.js';

export class DestroySoundEmitter extends SoundEmitterBase {
    static TypeName = 'sound-emitter-destroy';

    protected onInit(): void {
        this._emitterType = SoundEmitterType.BlockDestroy;
    }
}
