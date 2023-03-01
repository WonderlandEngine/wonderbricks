import {Component, InputComponent, Object, Scene, Type} from "@wonderlandengine/api";

import {getCurrentScene, getXrSessionStart} from "../../lib/WlApi";

import XrGamepad from "../input/XrGamepad";
import {PointerMode} from "./PointerMode";
import PointerRay from "./PointerRay";
import {XrInputButton} from "../input/XrInputButton";

import BuildController from "./../buildSystem/BuildController";
import GridManager from "./../grid/GridManager";
import TagUtils from "./../../utils/TagUtils";
import {Tag} from "../../utils/Tag";
import UiButton from "./../../ui/UiButton";

export default class XrController extends Component
{
    static TypeName = 'XR-Controller';
    static Properties = {
        pointerMode: {type: Type.Int, default: 0},
        inputObject: {type: Type.Object, default: null},
        pointerRay: {type: Type.Object, default: null}
    }

    // Properties definition
    private pointerMode: number;
    private inputObject: Object;
    private pointerRay: Object;
    private objectToPlace: Object;

    private _inputComponent: InputComponent;
    private _hand: XRHandedness;

    private _scene: Scene;
    private _xrGamepad: XrGamepad;
    private _pointerRayComponent: PointerRay;

    public override start()
    {
        // Get the current scene
        this._scene = getCurrentScene();

        // Set pointer mode to grid by default
        this.pointerMode = PointerMode.Grid;

        // Input component fetching
        if(this.inputObject === null)
            throw new Error("Input Object must be defined");

        this._inputComponent = this.inputObject.getComponent('input');
        this._hand = this._inputComponent.handedness;

        // Pointer Ray component fetching
        if(this.pointerRay === null)
            throw new Error("Pointer Ray Object must be defined");

        this._pointerRayComponent = this.pointerRay.getComponent(PointerRay);

        // Subscribe to XR session start event to setup inputs and other listeners
        getXrSessionStart().push(this.onXrSessionStart.bind(this));
    }

    public override update(delta: number)
    {
        if(this._xrGamepad == null) return;

        this._xrGamepad.update(); // Update inputs

        if(!this._pointerRayComponent.isPointing)
        {
            BuildController.setCurrentPrevizPosition([0, -5, 0]);
            return;
        }

        switch (TagUtils.getTag(this._pointerRayComponent.currentHitObject))
        {
            case Tag.BLOCK:
            case Tag.ENVIRONMENT: {
                // Update previs position
                const ptrPos = this._pointerRayComponent.currentHitPosition;
                const indices = GridManager.grid.getCellIndices(ptrPos[0], ptrPos[1], ptrPos[2]);
                const position = GridManager.grid.getCellPositionVec3(indices);

                if(this._xrGamepad.joystickXJustMoved)
                {
                    BuildController.addCurrentPrevizRotation(
                        0,
                        this._xrGamepad.joystickXValue > 0 ? 90: -90
                    );
                }

                BuildController.setCurrentPrevizPosition(position);
                break;
            }

            case Tag.UI: {
                BuildController.setCurrentPrevizPosition([0, -5, 0]);
                break;
            }
        }
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
            {
                console.log("Setup hand : " + current.handedness + " For XR Controller " + this._hand);
                this.setupXrGamepad(current.gamepad);
            }
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

        // Setup events listeners
        this._xrGamepad.getButton(XrInputButton.BUTTON_TRIGGER).addPressedListener(this.onPlacementTriggerPressed.bind(this));
        this._xrGamepad.getButton(XrInputButton.BUTTON_B_Y).addPressedListener(this.onDeleteButtonPressed.bind(this));
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
                console.log("Setup hand : " + current.handedness + " For XR Controller " + this._hand);
                this.setupXrGamepad(current.gamepad);
            }
        }
    }

    /**
     * Handler trigger input
     * @private
     */
    private onPlacementTriggerPressed(): void
    {
        if(!this._pointerRayComponent.currentHitObject)
            return;

        switch (TagUtils.getTag(this._pointerRayComponent.currentHitObject))
        {
            case Tag.BLOCK:
            case Tag.ENVIRONMENT: {
                let ptrPos = this._pointerRayComponent.currentHitPosition;
                let indices = GridManager.grid.getCellIndices(ptrPos[0], ptrPos[1], ptrPos[2]);
                let position = GridManager.grid.getCellPositionVec3(indices);

                BuildController.instanciatePrefabAt(position);
                break;
            }

            case Tag.UI: {
                const buttonComponent = this._pointerRayComponent.currentHitObject.getComponent(UiButton) as UiButton;
                if(buttonComponent) { buttonComponent.interact(); }
                break;
            }
        }
    }

    /**
     * Handler B button input
     * @private
     */
    private onDeleteButtonPressed(): void
    {
        if(!this._pointerRayComponent.currentHitObject)
            return;

        switch (TagUtils.getTag(this._pointerRayComponent.currentHitObject))
        {
            case Tag.BLOCK: {
                this._pointerRayComponent.currentHitObject.parent.destroy();
                break;
            }
        }
    }
}