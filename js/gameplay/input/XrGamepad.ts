import XrButton from "./XrButton";
import {XrInputButton} from "./XrInputButton";

/**
 * This class represent a Xr-standard controller
 * It handle the gamepad and update XrButton instances.
 *
 * Use example :
 * ```
     this._xrGamepad = new XrGamepad(current.gamepad, this._hand);
     console.log(this._xrGamepad);

     this._xrGamepad.getButton(XrInputButton.BUTTON_A_X).addPressedListener((btn: XrButton) => {
        console.log("PRESSED X Button");
    });

     this._xrGamepad.getButton(XrInputButton.BUTTON_A_X).addReleasedListener((btn: XrButton) => {
        console.log("Release X Button");
    });

     this._xrGamepad.getButton(XrInputButton.BUTTON_B_Y).addPressedListener((btn: XrButton) => {
        console.log("Y PRESSED");
    });
 * ```
 */
export default class XrGamepad
{
    private _hand: XRHandedness;
    private _gamepad: Gamepad;

    // @ts-ignore
    private _buttons: Map<XrInputButton, XrButton>;

    public get hand(): XRHandedness { return this._hand; }

    public constructor(gamepad: Gamepad, hand: XRHandedness)
    {
        this.setup(gamepad, hand);
    }

    public setup(gamepad: Gamepad, hand: XRHandedness): void
    {
        this._gamepad = gamepad;
        this._hand = hand;

        this.initButtons();
    }

    public update(): void
    {
        for (const key of this._buttons.keys())
        {
            this._buttons.get(key).update();
        }
    }

    public getButton(buttonIndex: XrInputButton): XrButton
    {
        return this._buttons.get(buttonIndex);
    }

    private initButtons(): void
    {
        let buttonsIndices = [
            XrInputButton.BUTTON_TRIGGER,
            XrInputButton.BUTTON_SQUEEZE,
            XrInputButton.BUTTON_A_X,
            XrInputButton.BUTTON_B_Y
        ]

        // Clear the map if needed
        if(this._buttons != null)
        {
            this._buttons.clear();
            this._buttons = null;
        }

        // @ts-ignore
        this._buttons = new Map<XrInputButton, XrButton>()

        for (let i = 0; i < buttonsIndices.length; ++i)
        {
            let index = buttonsIndices[i];
            let gamepadButton = this._gamepad.buttons[index];
            let button = new XrButton(gamepadButton, index);

            this._buttons.set(index, button);
        }
    }
}