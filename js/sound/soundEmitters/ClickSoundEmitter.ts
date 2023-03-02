import SoundEmitterBase from "../SoundEmitterBase";
import {SoundEmitterType} from "../SoundEmitterType";


export default class ClickSoundEmitter extends SoundEmitterBase
{
    static TypeName = 'sound-emitter-click';

    protected onInit(): void
    {
        this._emitterType = SoundEmitterType.Click;
    }
}