import {Component, InputComponent, Object3D} from "@wonderlandengine/api";
import {TeleportComponent} from "@wonderlandengine/components";
import {getXrSessionStart} from "../../lib/WlApi";
import XrGamepad from "../input/XrGamepad";
import {property} from '@wonderlandengine/api/decorators.js';

const AxisY = [0, 1, 0];
/**
 * snap-rotation
 */
export class SnapRotation extends Component {
    static TypeName = "snap-rotation";

    /* Properties that are configurable in the editor */
    
    @property.object()
    player: Object3D | null = null;

    @property.object()
    inputObject: Object3D | null = null;

    @property.object()
    cursor: Object3D | null = null;
    
    @property.float()
    sensitivity: number;

    private _inputComponent: InputComponent;
    private _hand: XRHandedness;
    private _xrGamepad: XrGamepad;
    private _teleportComponent: TeleportComponent;
    private _isTeleporting: boolean;


    start(): void
    {
        /** Input component fetching */
        if(this.inputObject === null) this.inputObject = this.object;
        this._inputComponent = this.inputObject.getComponent('input');
        this._hand = this._inputComponent.handedness;

        /** Subscribe to XR session start event to setup inputs and other listeners */
        getXrSessionStart().push(this.onXrSessionStart.bind(this));

        this._teleportComponent = this.cursor.getComponent(TeleportComponent);
    }

    /**
     * Callback for XR Session start.
     * Initialization of the input and listeners of session's events
     * @param session
     * @private
     */
    private onXrSessionStart(session: XRSession): void
    {
        this.inputSourcesSetup(session);
    }

    /**
     * Handle session start input sources and subscribe to Input Sources change
     * event to handle controllers changes while session is running.
     * @param session
     * @private
     */
    private inputSourcesSetup(session: XRSession): void
    {
        /** Initial gamepad fetching */
        for (let i = 0; i < session.inputSources.length; ++i)
        {
            let current = session.inputSources[i];

            if(current.handedness === this._hand)
            {
                this.setupXrGamepad(current.gamepad);
            }
        }

        /** Change XR Input Source Event **/
        session.addEventListener('inputsourceschange', this.onXrInputSourceChangeHandler.bind(this));
    }


    /**
     * Setup given gamepad and subscribe to all necessary events
     * in order to map actions on controls (Xr Buttons)
     * @param gamepad
     * @private
     */
    private setupXrGamepad(gamepad: Gamepad): void
    {
        this._xrGamepad = new XrGamepad(gamepad, this._hand);
    }

    /**
     * Handler for 'inputsourceschange' event
     * @param event
     * @private
     */
    private onXrInputSourceChangeHandler(event: XRInputSourceChangeEvent): void
    {
        for (let i = 0; i < event.added.length; ++i)
        {
            let current = event.added[i];

            if(current.handedness === this._hand)
            {
                this.setupXrGamepad(current.gamepad);
            }
        }
    }

    update()
    {
        if(this._xrGamepad == null) return;
        this._xrGamepad.update(); /** Update inputs */

        this._isTeleporting = this._teleportComponent.isIndicating;
        /**enable snap rotation only when player is  not teleporting */
        if(!this._isTeleporting)
        {
            if(this._xrGamepad.joystickXJustMoved) this.snap(this._xrGamepad.joystickXValue)
        }
    }

    private snap(xAxis: number): void
    {
        if(xAxis > this.sensitivity) this.rotateRight();
        if(xAxis < -this.sensitivity) this.rotateLeft();
    }

    private rotateLeft(): void
    {
        this.player.rotateAxisAngleDegObject(AxisY, 45);
    }

    private rotateRight(): void
    {
        this.player.rotateAxisAngleDegObject(AxisY, -45);
    }
}
