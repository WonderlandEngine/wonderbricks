import { Component, CustomParameter } from "@wonderlandengine/api";
import { Color } from "../../utils/materials/Color";
import { BlockSelectorInteractible } from "../BlockSelectorInteractible";
import { TextureSelectorInteractible } from "../TextureSelectorInteractible";


/**
 * This component manage the content and the bahaviour of the texture
 * selection panel that can be enabled with the arm menu
 */
export class TextureSelectionPanel extends Component
{
    static TypeName: string = 'block-selection-panel';
    static Properties: Record<string, CustomParameter> = { };

    // Private fields 
    private _buttons: Map<string, TextureSelectorInteractible>;

    public override init(): void 
    {
        this._buttons = new Map<string, TextureSelectorInteractible>();
    }

    // Each child buttons will register using this method
    public registerButton(button: TextureSelectorInteractible): void
    {
        this._buttons.set(button.object.name, button);
    }

    // Button will notify this panel on interaction
    public notifyInteraction(button: TextureSelectorInteractible): void
    {
        const keys = this._buttons.keys();

        // Reset all button's tint color
        for (const key of keys) 
        {
            const tmpBtn = this._buttons.get(key);
            tmpBtn.setVisualColor(Color.COLOR_TINT_NORMAL);
        }

        // Set the current selected button color to active tint
        button.setVisualColor(Color.COLOR_TINT_ACTIVE);
    }
}