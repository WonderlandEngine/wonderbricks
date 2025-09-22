import {Component, Object3D} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';

import {UiButton} from '../UiButton.js';
import {ObjectToggler} from '../../utils/ObjectToggler.js';
import {MenuController} from './MenuController.js';

export class InstructionPanel extends Component {
    public static TypeName = 'instructions-panel';

    /** Properties declaration */
    @property.object()
    private closeButtonObj: Object3D;
    @property.object()
    private armMenu: Object3D;

    /** Private Fields */
    private _objToggle: ObjectToggler;
    private _armMenu: MenuController;
    private _closeButton: UiButton;

    public override start() {
        // Add Object Toggler
        this._objToggle = this.object.addComponent(ObjectToggler);

        // Handle Menu controller
        this._armMenu = this.armMenu.getComponent(MenuController);

        // Get the UI Button component and set click Handler
        this._closeButton = this.closeButtonObj.getComponent(UiButton);
        this._closeButton.addInteractCallback(this.onCloseButtonClickedHandler.bind(this));
    }

    /**
     * Close the panel on close button clicked
     * @private
     */
    private onCloseButtonClickedHandler(): void {
        this._objToggle.setActive(false);
        this._armMenu.objectToggler.setActive(true);
    }
}
