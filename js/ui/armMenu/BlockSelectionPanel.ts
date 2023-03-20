import { Component, CustomParameter } from "@wonderlandengine/api";
import { Color } from "../../utils/materials/Color";
import { BlockSelectorInteractible } from "../BlockSelectorInteractible";


/**
 * This component manage the content and the bahaviour of the block
 * selection panel that can be enabled with the arm menu
 *
 * This panel contains pages that contain several elements
 * Each elements are placed by a grid layout
 */
export class BlockSelectionPanel extends Component
{
    static TypeName: string = 'block-selection-panel';
    static Properties: Record<string, CustomParameter> = { };

    // Private fields 
    private _buttons: Map<string, BlockSelectorInteractible>;

    public override init(): void 
    {
        this._buttons = new Map<string, BlockSelectorInteractible>();
    }

    // Each child buttons will register using this method
    public registerButton(button: BlockSelectorInteractible): void
    {
        this._buttons.set(button.object.name, button);
    }

    // Button will notify this panel on interaction
    public notifyInteraction(button: BlockSelectorInteractible): void
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