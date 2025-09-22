import {Component, InputComponent, MeshComponent, Object3D} from '@wonderlandengine/api';

import {getXrSessionStart} from '../../lib/WlApi.js';

import XrGamepad from '../input/XrGamepad.js';
import {PointerRay} from './PointerRay.js';
import {XrInputButton} from '../input/XrInputButton.js';

import BuildController from './../buildSystem/BuildController.js';
import GridManager from './../grid/GridManager.js';
import TagUtils from './../../utils/TagUtils.js';
import {Tag} from '../../utils/Tag.js';
import {UiButton} from './../../ui/UiButton.js';
import SoundSystem from '../../sound/SoundSystem.js';
import {SoundEmitterType} from '../../sound/SoundEmitterType.js';
import {MeshParticles} from '../particleSystem/Particle.js';
import {property} from '@wonderlandengine/api/decorators.js';
import {CloudMeshParticles} from '../particleSystem/CloudParticles.js';

export class XrController extends Component {
    static TypeName = 'XR-Controller';

    // Properties definition
    @property.object()
    inputObject: Object3D;

    @property.object()
    pointerRay: Object3D;

    private _meshParticleComponent: CloudMeshParticles | MeshParticles;
    private _inputComponent: InputComponent;
    private _hand: XRHandedness;

    private _xrGamepad: XrGamepad;
    private _pointerRayComponent: PointerRay;

    private _componentIteration: number;
    private _maximumIteration: number;
    private _maximumCloudIteration: number;
    private _cloudComponentIteration: number;

    init() {
        this._componentIteration = 0;
        this._maximumIteration = 4;
        this._maximumCloudIteration = 3;
        this._cloudComponentIteration = 0;
    }

    public override start() {
        // Input component fetching
        if (this.inputObject === null) throw new Error('Input Object must be defined');

        this._inputComponent = this.inputObject.getComponent('input');
        this._hand = this._inputComponent.handedness;

        // Pointer Ray component fetching
        if (this.pointerRay === null) throw new Error('Pointer Ray Object must be defined');

        this._pointerRayComponent = this.pointerRay.getComponent(PointerRay) as PointerRay;

        // Subscribe to XR session start event to setup inputs and other listeners
        getXrSessionStart().push(this.onXrSessionStart.bind(this));
    }

    public override update(delta: number) {
        if (this._xrGamepad == null) return;

        this._xrGamepad.update(); // Update inputs

        if (!this._pointerRayComponent.isPointing) {
            BuildController.setCurrentPrevisPosition([0, -5, 0]);
            return;
        }

        switch (TagUtils.getTag(this._pointerRayComponent.currentHitObject)) {
            case Tag.BLOCK:
            case Tag.ENVIRONMENT: {
                // Update previs position
                const ptrPos = this._pointerRayComponent.currentHitPosition;
                const indices = GridManager.grid.getCellIndices(
                    ptrPos[0],
                    ptrPos[1],
                    ptrPos[2]
                );
                const position = GridManager.grid.getCellPositionVec3(indices);

                if (this._xrGamepad.joystickXJustMoved) {
                    BuildController.addCurrentPrevisRotation(
                        0,
                        this._xrGamepad.joystickXValue > 0 ? 90 : -90
                    );

                    SoundSystem.playAt(
                        SoundEmitterType.BlockRotate,
                        this._pointerRayComponent.currentHitPosition
                    );
                }

                BuildController.setCurrentPrevisPosition(position);
                break;
            }

            case Tag.UI: {
                BuildController.setCurrentPrevisPosition([0, -5, 0]);
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
    private onXrSessionStart(session: XRSession): void {
        this.inputSourcesSetup(session);
    }

    /**
     * Handle session start input sources and subscribe to Input Sources change
     * event to handle controllers changes while session is running.
     * @param session
     * @private
     */
    private inputSourcesSetup(session: XRSession): void {
        // Initial gamepad fetching
        for (let i = 0; i < session.inputSources.length; ++i) {
            let current = session.inputSources[i];

            if (current.handedness === this._hand) {
                console.log(
                    'Setup hand : ' +
                        current.handedness +
                        ' For XR Controller ' +
                        this._hand
                );
                this.setupXrGamepad(current.gamepad);
            }
        }

        // Change XR Input Source Event
        session.addEventListener(
            'inputsourceschange',
            this.onXrInputSourceChangeHandler.bind(this)
        );
    }

    /**
     * Setup given gamepad and subscribe to all necessary events
     * in order to map actions on controls (Xr Buttons)
     * @param gamepad
     * @private
     */
    private setupXrGamepad(gamepad: Gamepad): void {
        this._xrGamepad = new XrGamepad(gamepad, this._hand);

        // Setup events listeners
        this._xrGamepad
            .getButton(XrInputButton.BUTTON_TRIGGER)
            .addPressedListener(this.onPlacementTriggerPressed.bind(this));
        this._xrGamepad
            .getButton(XrInputButton.BUTTON_B_Y)
            .addPressedListener(this.onDeleteButtonPressed.bind(this));
    }

    /**
     * Handler for 'inputsourceschange' event
     * @param event
     * @private
     */
    private onXrInputSourceChangeHandler(event: XRInputSourcesChangeEvent): void {
        for (let i = 0; i < event.added.length; ++i) {
            let current = event.added[i];

            if (current.handedness === this._hand) {
                console.log(
                    'Setup hand : ' +
                        current.handedness +
                        ' For XR Controller ' +
                        this._hand
                );
                this.setupXrGamepad(current.gamepad);
            }
        }
    }

    /**
     * Handler trigger input
     * @private
     */
    private onPlacementTriggerPressed(): void {
        if (!this._pointerRayComponent.currentHitObject) return;

        switch (TagUtils.getTag(this._pointerRayComponent.currentHitObject)) {
            case Tag.BLOCK:
            case Tag.ENVIRONMENT: {
                let ptrPos = this._pointerRayComponent.currentHitPosition;
                let indices = GridManager.grid.getCellIndices(
                    ptrPos[0],
                    ptrPos[1],
                    ptrPos[2]
                );
                let position = GridManager.grid.getCellPositionVec3(indices);
                const currentPrefabObject =
                    BuildController.instantiatePrefabAt(position)[0];
                SoundSystem.playAt(
                    SoundEmitterType.BlockPlaced,
                    this._pointerRayComponent.currentHitPosition
                );
                this._meshParticleComponent = this.object.getComponent(
                    CloudMeshParticles,
                    this._cloudComponentIteration
                );
                ++this._cloudComponentIteration;
                if (this._cloudComponentIteration > this._maximumCloudIteration)
                    this._cloudComponentIteration = 0;
                this._meshParticleComponent.time = 0;
                this._meshParticleComponent.spawnObjLocation = currentPrefabObject;
                this._meshParticleComponent.spawn();
                break;
            }

            case Tag.UI: {
                const buttonComponent =
                    this._pointerRayComponent.currentHitObject.getComponent(
                        UiButton
                    ) as UiButton;
                if (buttonComponent) {
                    buttonComponent.interact();
                    SoundSystem.playAt(
                        SoundEmitterType.Click,
                        this._pointerRayComponent.currentHitPosition
                    );
                }
                break;
            }
        }
    }

    /**
     * Handler B button input
     * @private
     */
    private onDeleteButtonPressed(): void {
        if (!this._pointerRayComponent.currentHitObject) return;

        switch (TagUtils.getTag(this._pointerRayComponent.currentHitObject)) {
            case Tag.BLOCK: {
                /**
                 * Particle System
                 *
                 * Pool MeshParticles components in the editor
                 * Each time when we get component iterate to next MeshParticles
                 * if iteration exeeds pooled component count (_maximumIteration), reset iteration number
                 */

                const mat =
                    this._pointerRayComponent.currentHitObject.getComponent(
                        MeshComponent
                    ).material;
                this._meshParticleComponent = this.object.getComponent(
                    MeshParticles,
                    this._componentIteration
                )!;
                this._componentIteration++;
                if (this._componentIteration > this._maximumIteration)
                    this._componentIteration = 0;
                this._meshParticleComponent.changeMaterial(mat);
                this._meshParticleComponent.time = 0;
                this._meshParticleComponent.spawnObjLocation =
                    this._pointerRayComponent.currentHitObject.parent;
                this._meshParticleComponent.spawn();

                /** Destroy Block */

                this._pointerRayComponent.currentHitObject.parent.destroy();
                SoundSystem.playAt(
                    SoundEmitterType.BlockDestroy,
                    this._pointerRayComponent.currentHitPosition
                );
                break;
            }
        }
    }
}
