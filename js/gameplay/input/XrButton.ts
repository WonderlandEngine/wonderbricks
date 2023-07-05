import {XrInputButton} from "./XrInputButton";

export type XrButtonListener = (button: XrButton) => void;

export default class XrButton
{
    private _gamepadButton: GamepadButton;

    private _index: number;
    private _isPressed: boolean;
    private _wasPressed: boolean;

    private _onPressedEvent: Array<XrButtonListener>
    private _onReleasedEvent: Array<XrButtonListener>

    public get isPressed(): boolean { return this._isPressed }
    public get wasPressed(): boolean { return this._wasPressed }

    public constructor(gamepadButton: GamepadButton, index: XrInputButton)
    {
        this._gamepadButton = gamepadButton;

        this._index = index;
        this._isPressed = false;
        this._wasPressed = false;

        this._onPressedEvent = new Array<XrButtonListener>();
        this._onReleasedEvent = new Array<XrButtonListener>();
    }

    public update(): void
    {   
        if(this._gamepadButton == null ) return
        this._isPressed = this._gamepadButton.pressed;

        // Just pressed
        if(this._isPressed && !this._wasPressed)
        {
            for (let onPressedEventListener of this._onPressedEvent)
            {
                onPressedEventListener(this);
            }

            this._wasPressed = true;
        }

        // Just released
        if(!this._isPressed && this._wasPressed)
        {
            for (let i = 0; i < this._onReleasedEvent.length; i++)
                this._onReleasedEvent[i](this);

            this._wasPressed = false;
        }
    }

    public addPressedListener(listener: XrButtonListener): number
    {
        return this._onPressedEvent.push(listener) - 1;
    }

    public addReleasedListener(listener: XrButtonListener): number
    {
        return this._onReleasedEvent.push(listener) - 1;
    }

    public removePressedListener(handler: number): void
    {
        this._onPressedEvent.splice(handler, 1);
    }

    public removeReleasedListener(handler: number): void
    {
        this._onReleasedEvent.splice(handler, 1);
    }

    public clearPressedListeners(): void { this._onPressedEvent = new Array<XrButtonListener>(); }
    public clearReleasedListeners(): void { this._onReleasedEvent = new Array<XrButtonListener>(); }
}