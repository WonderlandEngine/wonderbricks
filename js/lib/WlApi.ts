import type {Scene, WonderlandEngine, Emitter} from '@wonderlandengine/api';

declare global {
    interface Window {
        WL: WonderlandEngine;
    }
}

export function getCurrentScene(): Scene {
    return window.WL.scene;
}

export function getEngine(): WonderlandEngine {
    return window.WL;
}

export function getXrSessionStart(): Emitter<[XRSession, XRSessionMode]> {
    return window.WL.onXRSessionStart;
}
