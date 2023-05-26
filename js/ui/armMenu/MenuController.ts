import { Component, ComponentProperty, Object, Type } from "@wonderlandengine/api";
import { ArmPanel } from "./ArmPanel.js";
import { MenuSelectionButton } from "./MenuSelectionButton.js";
import {ObjectToggler} from "../../utils/ObjectToggler.js";


export class MenuController extends Component
{
    static TypeName: string = 'menu-controller';
    static Properties: Record<string, ComponentProperty> = {
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
    // Toggle component
    private _objToggle: ObjectToggler;

    // Buttons
    private _menuButtonComp: MenuSelectionButton;
    private _blockButtonComp: MenuSelectionButton;
    private _textureButtonComp: MenuSelectionButton;

    // Panels
    private _menuPanelComp: ArmPanel;
    private _blockPanelComp: ArmPanel;
    private _texturePanelComp: ArmPanel;

    // Accessors
    public get objectToggler(): ObjectToggler { return this._objToggle; }

    public override start(): void 
    {
        // Add Object Toggler
        this._objToggle = this.object.addComponent(ObjectToggler);

        // Get buttons components
        this._menuButtonComp = this.menuButton.getComponent(MenuSelectionButton);
        this._blockButtonComp = this.blockButton.getComponent(MenuSelectionButton);
        this._textureButtonComp = this.textureButton.getComponent(MenuSelectionButton);

        // Set interaction callbacks
        this._menuButtonComp.button.addInteractCallback(this.onMenuButtonPressed.bind(this));
        this._blockButtonComp.button.addInteractCallback(this.onBlockButtonPressed.bind(this));
        this._textureButtonComp.button.addInteractCallback(this.onTextureButtonPressed.bind(this));

        this._menuPanelComp = this.menuPanel.getComponent(ArmPanel);
        this._blockPanelComp = this.blockPanel.getComponent(ArmPanel);
        this._texturePanelComp = this.texturePanel.getComponent(ArmPanel);
        
        this.engine.onXRSessionStart.push(() => {
            setTimeout(() => {
                this._menuPanelComp.hide();
                this._blockPanelComp.hide();
                this._texturePanelComp.hide();
                this._objToggle.setActive(false);
            }, 100);
        });
    }

    private onMenuButtonPressed(): void 
    {
        // Check if already active
        if(this._menuButtonComp.isActive)
        {
            this._menuButtonComp.setActive(false);
            this._menuPanelComp.hide();
            return;
        }

        this._menuButtonComp.setActive(true);
        this._menuPanelComp.show();

        this._blockButtonComp.setActive(false);
        this._textureButtonComp.setActive(false);
        this._blockPanelComp.hide();
        this._texturePanelComp.hide();
    }
    
    private onBlockButtonPressed(): void 
    {
        // Check if already active
        if(this._blockButtonComp.isActive)
        {
            this._blockButtonComp.setActive(false);
            this._blockPanelComp.hide();
            return;
        }

        this._blockButtonComp.setActive(true);
        this._blockPanelComp.show();

        this._menuButtonComp.setActive(false);
        this._textureButtonComp.setActive(false);
        this._menuPanelComp.hide();
        this._texturePanelComp.hide();
    }

    private onTextureButtonPressed(): void 
    {
        // Check if already active
        if(this._textureButtonComp.isActive)
        {
            this._textureButtonComp.setActive(false);
            this._texturePanelComp.hide();
            return;
        }

        this._textureButtonComp.setActive(true);
        this._texturePanelComp.show();

        this._menuButtonComp.setActive(false);
        this._blockButtonComp.setActive(false);
        this._menuPanelComp.hide();
        this._blockPanelComp.hide();
    }
}