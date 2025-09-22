import {SoundEmitterBase} from '../SoundEmitterBase.js';
import {SoundEmitterType} from '../SoundEmitterType.js';

export class RotateSoundEmitter extends SoundEmitterBase {
    static TypeName = 'sound-emitter-rotate';

    protected onInit(): void {
        this._emitterType = SoundEmitterType.BlockRotate;
    }
}
