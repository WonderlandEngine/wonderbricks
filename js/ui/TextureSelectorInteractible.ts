import {
    Component,
    ComponentProperty,
    MeshComponent,
    Object3D as Object,
    Type,
} from '@wonderlandengine/api';
import {UiButton} from './UiButton.js';

import BuildController from '../gameplay/buildSystem/BuildController.js';
import {TextureInformation} from '../utils/textures/TextureInformation.js';
import {TextureSelectionPanel} from './armMenu/TextureSelectionPanel.js';
import {vec4} from 'gl-matrix';

export class TextureSelectorInteractible extends Component {
    static TypeName: string = 'texture-selector-interactible';
    static Properties: Record<string, ComponentProperty> = {
        textureInfoObject: {type: Type.Object, default: null},
        isDefaultTexture: {type: Type.Bool, default: false},
    };

    private textureInfoObject: Object;
    private isDefaultTexture: boolean;

    // fields
    private _texture: TextureInformation;
    private _buttonComponent: UiButton;
    private _mesh: MeshComponent;

    private _parent: TextureSelectionPanel;

    public override start() {
        if (!this.textureInfoObject) {
            console.error('Object must be set to initialize the button ', this.object.name);
            return;
        }

        this._texture = this.textureInfoObject.getComponent(TextureInformation);

        this._buttonComponent = this.object.getComponent(UiButton);
        this._buttonComponent.addInteractCallback(this.onInteractHandler.bind(this));

        this._mesh = this.object.getComponent('mesh');
        let material = this._mesh.material;
        this._mesh.material = material.clone();

        // Get parent BlockSelectionPanel component
        this._parent = this.object.parent.getComponent(TextureSelectionPanel);
        this._parent.registerButton(this);

        if (this.isDefaultTexture) this.onInteractHandler();
    }

    public setVisualColor(color: vec4): void {
        this._mesh.material['color'] = color;
    }

    private onInteractHandler(): void {
        BuildController.setTexture(this._texture);
        this._parent.notifyInteraction(this);
    }
}
