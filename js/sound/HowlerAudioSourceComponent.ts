import {Component} from '@wonderlandengine/api';

/**
 * Declaration of the Howler JS Component
 */
export declare class HowlerAudioSourceComponent extends Component {
    autoplay: boolean;
    loop: boolean;
    src: string;

    play(): void;
    stop(): void;
}
