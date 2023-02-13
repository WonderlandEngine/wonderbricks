import {Component, InputComponent, Object, Type} from "@wonderlandengine/api";
import {getXrSessionStart} from "../../lib/WlApi";

import XrGamepad from "../input/XrGamepad";
import {XrInputButton} from "../input/XrInputButton";
import XrButton from "../input/XrButton";
import {PointerMode} from "./PointerMode";

export default class InteractionPointer extends Component
{
    static TypeName = 'interaction-pointer';
    static Properties = {
        pointerMode: {type: Type.Int, default: 0},
        inputObject: {type: Type.Object, default: null},
        inputIndicator: {type: Type.Object, default: null}
    }

    // Properties definition
    private pointerMode: number;
    private inputObject: Object;

    private _inputComponent: InputComponent;
    private _hand: XRHandedness;

    private _xrGamepad: XrGamepad;

    public override start()
    {
        // Set pointer mode to grid by default
        this.pointerMode = PointerMode.Grid;

        if(this.inputObject === null)
            throw new Error("Input Object must be defined");

        this._inputComponent = this.inputObject.getComponent('input');
        this._hand = this._inputComponent.handedness;

        getXrSessionStart().push(this.onXrSessionStart.bind(this));
    }

    public override update(delta: number)
    {
        if(this._xrGamepad == null) return;

        this._xrGamepad.update(); // Update inputs
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
        // Initial gamepad fetching
        for (let i = 0; i < session.inputSources.length; ++i)
        {
            let current = session.inputSources[i];

            if(current.handedness === this._hand)
                this.setupXrGamepad(current.gamepad);
        }

        // Change XR Input Source Event
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
                this.setupXrGamepad(current.gamepad);
        }
    }
}