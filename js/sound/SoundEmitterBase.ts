import {Component} from '@wonderlandengine/api';
import {HowlerAudioSourceComponent} from './HowlerAudioSourceComponent.js';
import {SoundEmitterType} from './SoundEmitterType.js';
import {vec3} from 'gl-matrix';
import SoundSystem from './SoundSystem.js';

export abstract class SoundEmitterBase extends Component {
    static TypeName = 'sound-emitter-base';
    static Properties = {};

    protected _audioSource: HowlerAudioSourceComponent;
    protected _emitterType: SoundEmitterType;

    public get emitterType(): SoundEmitterType {
        return this._emitterType;
    }

    public override init() {
        this.onInit();

        SoundSystem.registerEmitter(this);
    }

    public override start() {
        this._audioSource = this.object.getComponent(
            'howler-audio-source'
        ) as HowlerAudioSourceComponent;
    }

    /**
     * Use this method to set emitter type and process
     * other init task instead of Init
     */
    protected abstract onInit(): void;

    public playAt(position: vec3): void {
        this.object.setPositionWorld(position);
        this._audioSource.play();
    }
}
