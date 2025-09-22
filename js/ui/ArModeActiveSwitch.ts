import {Component, Material, Object3D, Type} from '@wonderlandengine/api';
import {TeleportComponent} from '@wonderlandengine/components';
import {SnapRotation} from '../gameplay/interactions/SnapRotation.js';

/**
 * ar-mode-active-switch
 */
export class ArModeActiveSwitch extends Component {
    static TypeName = 'ar-mode-active-switch';

    /* Properties that are configurable in the editor */
    static Properties = {
        /** When components should be active: In VR or when not in VR */
        activateComponents: {
            type: Type.Enum,
            values: ['in AR', 'in non-AR'],
            default: 'in AR',
        },
        /** Whether child object's components should be affected */
        affectChildren: {type: Type.Bool, default: true},
        disableLocomotion: {type: Type.Bool, default: false},
        teleportCursor: {type: Type.Object},
        snapRotationController: {type: Type.Object},
    };

    private arButton: HTMLElement;
    private sessionType: string;
    private skymat: Material;
    private components: Component[] = [];
    private onSessionStartCallback: any;
    private onSessionEndCallback: any;
    private affectChildren: boolean;
    private disableLocomotion: boolean;
    private activateComponents: number;
    private teleportCursor: Object3D;
    private snapRotationController: Object3D;
    private teleportComponent: TeleportComponent;
    private snapRotationComponent: SnapRotation;

    arButtonClickCallback() {
        this.sessionType = 'AR';
    }

    start() {
        this.arButton = document.getElementById('ar-button');
        this.arButton.addEventListener('mousedown', this.arButtonClickCallback.bind(this));
        this.arButton.addEventListener('touchdown', this.arButtonClickCallback.bind(this));
        if (this.disableLocomotion) {
            this.teleportComponent = this.teleportCursor.getComponent(TeleportComponent);
            this.snapRotationComponent =
                this.snapRotationController.getComponent(SnapRotation);
        }
        this.skymat = this.engine.scene.skyMaterial;
        this.getComponents(this.object);
        /* Initial activation/deactivation */
        this.onXRSessionEnd();
        this.onSessionStartCallback = this.onXRSessionStart.bind(this);
        this.onSessionEndCallback = this.onXRSessionEnd.bind(this);
    }
    onActivate() {
        this.engine.onXRSessionStart.add(this.onSessionStartCallback);
        this.engine.onXRSessionEnd.add(this.onSessionEndCallback);
    }
    onDeactivate() {
        this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
        this.engine.onXRSessionEnd.remove(this.onSessionEndCallback);
    }
    getComponents(obj) {
        const comps = obj.getComponents().filter((c) => c.type !== 'ar-mode-active-switch');
        this.components = this.components.concat(comps);
        if (this.affectChildren) {
            let children = obj.children;
            for (let i = 0; i < children.length; ++i) {
                this.getComponents(children[i]);
            }
        }
    }
    setComponentsActive(active) {
        const comps = this.components;
        for (let i = 0; i < comps.length; ++i) {
            comps[i].active = active;
        }
    }
    onXRSessionStart() {
        if (this.sessionType === 'AR') {
            this.arSessionStartCallback();
        }
    }
    onXRSessionEnd() {
        if (this.sessionType === 'AR') {
            this.arSessionEndCallback();
        }
    }

    arSessionStartCallback() {
        this.setComponentsActive(this.activateComponents == 0);
        /** Write additional code on ar session start here **/
        this.engine.scene.skyMaterial = null;
        console.log(this.disableLocomotion);
        if (this.disableLocomotion) {
            setTimeout(() => {
                this.teleportComponent.active = false;
                this.snapRotationComponent.active = false;
            }, 1000);
        }
    }

    arSessionEndCallback() {
        this.sessionType = '';
        this.setComponentsActive(this.activateComponents != 0);
        /** Write additional code on ar session end here **/
        this.engine.scene.skyMaterial = this.skymat;
    }
}
