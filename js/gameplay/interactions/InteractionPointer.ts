import {Component, InputComponent, Object, Type} from "@wonderlandengine/api";
import {getXrSessionStart} from "../../lib/WlApi";
import XrGamepad from "../input/XrGamepad";
import {XrInputButton} from "../input/XrInputButton";
import XrButton from "../input/XrButton";

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
    private inputIndicator: Object;

    private _inputComponent: InputComponent;
    private _gamepad : Gamepad;
    private _hand: 'left' | 'right';

    private _xrGamepad: XrGamepad;

    public override start()
    {
        if(this.inputObject === null)
            throw new Error("Input Object must be defined");

        this._inputComponent = this.inputObject.getComponent('input');
        this._hand = this._inputComponent.handedness;

        getXrSessionStart().push(this.onXrSessionStart.bind(this));
    }

    public override update(delta: number)
    {
        if(this._xrGamepad == null) return;

        this._xrGamepad.update();
    }

    private onXrSessionStart(session: XRSession): void
    {
        session.addEventListener('selectstart', this.selectStartCallback.bind(this))
        session.addEventListener('selectend', this.selectEndCallback.bind(this))

        // Initial gamepad fetching
        for (let i = 0; i < session.inputSources.length; ++i)
        {
            let current = session.inputSources[i];
            console.log(current);
            if(current.handedness === this._hand)
            {
                this._xrGamepad = new XrGamepad(current.gamepad, this._hand);
                console.log(this._xrGamepad);
            }
        }

        // Change XR Input Source Event
        session.addEventListener('inputsourceschange', (event: XRInputSourceChangeEvent) => {
            for (let i = 0; i < event.added.length; ++i)
            {
                let current = event.added[i];
                console.log(current.handedness + " " + this._hand);
                if(current.handedness === this._hand)
                {
                    this._xrGamepad = new XrGamepad(current.gamepad, this._hand);
                    console.log(this._xrGamepad);

                    this._xrGamepad.getButton(XrInputButton.BUTTON_A_X).addPressedListener((btn: XrButton) => {
                        console.log("OUUUUUUUIIIIIIIIIIIIIIII");
                    });

                    this._xrGamepad.getButton(XrInputButton.BUTTON_A_X).addReleasedListener((btn: XrButton) => {
                        console.log("NOOOOOOOOOOOONNNNNNNNNNN");
                    });

                    this._xrGamepad.getButton(XrInputButton.BUTTON_B_Y).addPressedListener((btn: XrButton) => {
                        console.log("Y PRESSED");
                    });
                }
            }
        });
    }

    private selectStartCallback(event: XRInputSourceEvent): void
    {
        console.log(event);
        this.inputIndicator.active = false;
    }

    private selectEndCallback(event: XRInputSourceEvent): void
    {
        console.log(event);
        this.inputIndicator.active = true;
    }
}