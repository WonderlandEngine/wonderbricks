import {SoundEmitterBase} from '../SoundEmitterBase.js';
import {SoundEmitterType} from '../SoundEmitterType.js';

export class ClickSoundEmitter extends SoundEmitterBase {
    static TypeName = 'sound-emitter-click';

    protected onInit(): void {
        this._emitterType = SoundEmitterType.Click;
    }
}
