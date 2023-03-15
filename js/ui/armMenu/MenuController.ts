import { Component, CustomParameter, Object, Type } from "@wonderlandengine/api";
import { MenuSelectionButton } from "./MenuSelectionButton";


export class MenuController extends Component
{
    static TypeName: string = 'menu-controller';
    static Properties: Record<string, CustomParameter> = {
        // Buttons
        menuButton: {type: Type.Object},
        blockButton: {type: Type.Object},
        textureButton: {type: Type.Object},

        // Panels
        menuPanel: {type: Type.Object},
        blockPanel: {type: Type.Object},
        texturePanel: {type: Type.Object},
    };

    // Properties declaration
    // Buttons
    private menuButton: Object;
    private blockButton: Object;
    private textureButton: Object;

    // Panels
    private menuPanel: Object;
    private blockPanel: Object;
    private texturePanel: Object;

    // Fields declaration
    private _menuButtonComp: MenuSelectionButton;
    private _blockButtonComp: MenuSelectionButton;
    private _textureButtonComp: MenuSelectionButton;

    public override start(): void 
    {
        // Get buttons components
        this._menuButtonComp = this.menuButton.getComponent(MenuSelectionButton);
        this._blockButtonComp = this.blockButton.getComponent(MenuSelectionButton);
        this._textureButtonComp = this.textureButton.getComponent(MenuSelectionButton);

        // Set interaction callbacks
        this._menuButtonComp.button.addInteractCallback(this.onMenuButtonPressed.bind(this));
        this._blockButtonComp.button.addInteractCallback(this.onBlockButtonPressed.bind(this));
        this._textureButtonComp.button.addInteractCallback(this.onTextureButtonPressed.bind(this));

        // Disable all panels
        this.menuPanel.active = false;
        this.blockPanel.active = false;
        this.texturePanel.active = false;
    }

    private onMenuButtonPressed(): void 
    {
        this._menuButtonComp.setActive(true);
        this.menuPanel.active = true;

        this._blockButtonComp.setActive(false);
        this._textureButtonComp.setActive(false);
        this.blockPanel.active = false;
        this.texturePanel.active = false;
    }
    
    private onBlockButtonPressed(): void 
    {
        this._blockButtonComp.setActive(true);
        this.blockPanel.active = true;

        this._menuButtonComp.setActive(false);
        this._textureButtonComp.setActive(false);
        this.menuPanel.active = false;
        this.texturePanel.active = false;
    }

    private onTextureButtonPressed(): void 
    {
        this._textureButtonComp.setActive(true);
        this.texturePanel.active = true;

        this._menuButtonComp.setActive(false);
        this._blockButtonComp.setActive(false);
        this.menuPanel.active = false;
        this.blockPanel.active = false;
    }
}