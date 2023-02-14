import {CollisionComponent, Component, InputComponent, MeshComponent, Object, Scene, Type} from "@wonderlandengine/api";
import {getCurrentScene, getXrSessionStart} from "../../lib/WlApi";

import XrGamepad from "../input/XrGamepad";
import {PointerMode} from "./PointerMode";
import PointerRay from "./PointerRay";
import {XrInputButton} from "../input/XrInputButton";

export default class XrController extends Component
{
    static TypeName = 'XR-Controller';
    static Properties = {
        pointerMode: {type: Type.Int, default: 0},
        inputObject: {type: Type.Object, default: null},
        pointerRay: {type: Type.Object, default: null},
        objectToPlace: {type: Type.Object, default: null}
    }

    // Properties definition
    private pointerMode: number;
    private inputObject: Object;
    private pointerRay: Object;
    private objectToPlace: Object;

    // Object to place components
    private _otpMesh: MeshComponent;
    private _otpCollision: CollisionComponent;

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
        if(this.inputObject === null)
            throw new Error("Input Object must be defined");

        this._pointerRayComponent = this.pointerRay.getComponent(PointerRay);
        if(this.pointerRay === null)
            throw new Error("Pointer Ray Object must be defined");

        // Object to place components fetching
        this._otpMesh = this.objectToPlace.children[0].getComponent('mesh');
        this._otpCollision = this.objectToPlace.children[0].getComponent('collision');

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

        // Setup events listeners
        this._xrGamepad.getButton(XrInputButton.BUTTON_TRIGGER).addPressedListener(this.onPlacementTriggerPressed.bind(this));
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

    private onPlacementTriggerPressed(): void
    {
        let position = this._pointerRayComponent.currentCellWorldPos;
        position[1] += 0.5;

        // Create new object in the scene
        let newObject = this._scene.addObject(null);

        console.log(newObject);

        // Set components
        newObject.addComponent('mesh', {
            mesh: this._otpMesh.mesh,
            material: this._otpMesh.material
        });

        let coll = newObject.addComponent('collision', {
            extents: this._otpCollision.extents,
            group: this._otpCollision.group
        }) as CollisionComponent;
        coll.active = true;
        console.log(coll);

        // Set world position based on grid
        newObject.scale(this.objectToPlace.children[0].scalingWorld);
        newObject.setTranslationWorld(position);
    }
}