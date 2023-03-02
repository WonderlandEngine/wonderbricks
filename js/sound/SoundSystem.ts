import SoundEmitterBase from "./SoundEmitterBase";
import {SoundEmitterType} from "./SoundEmitterType";
import {vec3} from "gl-matrix";


class SoundSystem
{
    private _soundEmitters: Map<SoundEmitterType, SoundEmitterBase>;

    public constructor()
    {
        this._soundEmitters = new Map<SoundEmitterType, SoundEmitterBase>();
    }

    public registerEmitter(soundEmitter: SoundEmitterBase): void
    {
        if(this._soundEmitters.has(soundEmitter.emitterType))
        {
            console.warn('Only one emitter can be register by type');
            return;
        }

        console.log(`Register emmitter ${soundEmitter.emitterType}`);
        this._soundEmitters.set(soundEmitter.emitterType, soundEmitter);
    }

    public playAt(soundEmitterType: SoundEmitterType, position: vec3): void
    {
        if(!this._soundEmitters.has(soundEmitterType))
        {
            console.warn(`Can't play sound from emitter ${soundEmitterType}. It doesn't exist`);
            return;
        }

        this._soundEmitters.get(soundEmitterType).playAt(position);
    }
}

export default new SoundSystem();