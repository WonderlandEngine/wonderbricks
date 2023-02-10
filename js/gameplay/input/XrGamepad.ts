import XrButton from "./XrButton";
import {XrInputButton} from "./XrInputButton";


export default class XrGamepad
{
    private _hand: 'left' | 'right';
    private _gamepad: Gamepad;


    // @ts-ignore
    private _buttons: Map<XrInputButton, XrButton>;

    public get hand(): 'left' | 'right' { return this._hand; }

    public constructor(gamepad: Gamepad, hand: 'left' | 'right')
    {
        this.setup(gamepad, hand);
    }

    public setup(gamepad: Gamepad, hand: 'left' | 'right'): void
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

        console.log(this._buttons);
    }
}