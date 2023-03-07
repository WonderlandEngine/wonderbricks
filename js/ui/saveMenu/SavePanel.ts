import {Component, Object, TextComponent, Type} from "@wonderlandengine/api";
import {UiButton} from "../UiButton";
import SerializationUtils from "../../gameplay/serialization/SerializationUtils";
import {SceneBuildData} from "../../gameplay/serialization/SarielizationData";
import BuildController from "../../gameplay/buildSystem/BuildController";


export class SavePanel extends Component
{
    static TypeName = 'save-panel';
    static Properties = {
        loadButtonObj: {type: Type.Object, default: null},
        newButtonObj: {type: Type.Object, default: null},
        nextButtonObj: {type: Type.Object, default: null},
        saveButtonObj: {type: Type.Object, default: null},
        removeButtonObj: {type: Type.Object, default: null},

        saveCountObj: {type: Type.Object, default: null},
        saveNameObj: {type: Type.Object, default: null},
    };

    // Properties declaration
    private loadButtonObj: Object;
    private newButtonObj: Object;
    private nextButtonObj: Object;
    private saveButtonObj: Object;
    private removeButtonObj: Object;

    private saveCountObj: Object;
    private saveNameObj: Object;

    // Buttons components
    private _loadButton: UiButton;
    private _newButton: UiButton;
    private _nextButton: UiButton;
    private _saveButton: UiButton;
    private _removeButton: UiButton;

    // Text components
    private _saveCount: TextComponent;
    private _saveName: TextComponent;

    // Cache saves
    private _saveEntries: Array<SceneBuildData>;

    // Information tracking
    private _currentSaveIndex: number;
    private _currentBuildData: SceneBuildData;

    public override start()
    {
        // Get buttons
        this._loadButton = this.loadButtonObj.getComponent(UiButton);
        this._newButton = this.newButtonObj.getComponent(UiButton);
        this._nextButton = this.nextButtonObj.getComponent(UiButton);
        this._saveButton = this.saveButtonObj.getComponent(UiButton);
        this._removeButton = this.removeButtonObj.getComponent(UiButton);

        // Set interact callbacks
        this._loadButton.addInteractCallback(this.onLoadButtonClicked.bind(this));
        this._newButton.addInteractCallback(this.onNewButtonPressed.bind(this));
        this._nextButton.addInteractCallback(this.onNextButtonPressed.bind(this));
        this._saveButton.addInteractCallback(this.onSaveButtonPressed.bind(this));
        this._removeButton.addInteractCallback(this.onRemoveButtonPressed.bind(this));

        // Get texts
        this._saveCount = this.saveCountObj.getComponent('text');
        this._saveName = this.saveNameObj.getComponent('text');

        this._saveEntries = SerializationUtils.getSavesEntries();
        this._currentSaveIndex = this._saveEntries.length < 1 ? -1: 0;

        this._saveCount.text = 'Saves: ' + this._saveEntries.length;
        this._saveName.text = this._currentSaveIndex < 0 ? "No save available": this._saveEntries[0].name;

        this.loadBlankSave();
    }

    // Buttons callbacks

    private onLoadButtonClicked(): void
    {
        if(this._currentSaveIndex < 0)
            return;

        this._currentBuildData = this._saveEntries[this._currentSaveIndex];
        console.log(this._currentBuildData);
        BuildController.loadBuild(this._currentBuildData.blocks);
    }

    private onNewButtonPressed(): void
    {
        this.setCurrentSelectedSave(-1); // Set empty save as current
        BuildController.loadBuild(this._currentBuildData.blocks);
    }

    private onNextButtonPressed(): void
    {
        this._currentSaveIndex++;
        if(this._currentSaveIndex > this._saveEntries.length - 1)
            this._currentSaveIndex = 0;

        this.setCurrentSelectedSave(this._currentSaveIndex);

        // Update UI
        this._saveName.text = this._currentSaveIndex < 0 ? "No save available": this._currentBuildData.name;
    }

    private onSaveButtonPressed(): void
    {
        this._currentBuildData.blocks = BuildController.getCurrentBuildData();
        SerializationUtils.createOrUpdateSaveEntry(this._currentBuildData);
        SerializationUtils.flushSaves();

        this._saveEntries = SerializationUtils.getSavesEntries();
        this._currentSaveIndex = this._currentSaveIndex < 0 ? 0 : this._currentSaveIndex;

        this._saveCount.text = 'Saves: ' + this._saveEntries.length;
        this._saveName.text = this._currentSaveIndex < 0 ?
            "No save available":
            this._saveEntries[this._currentSaveIndex].name;
    }

    private onRemoveButtonPressed(): void
    {
        if(this._currentSaveIndex < 0)
            return;

        let saveToDelete = this._saveEntries[this._currentSaveIndex];
        if(saveToDelete.name == this._currentBuildData.name)
        {
            this.setCurrentSelectedSave(-1); // Set an empty save
            BuildController.loadBuild(this._currentBuildData.blocks);
        }

        SerializationUtils.removeSaveEntry(saveToDelete);
        SerializationUtils.flushSaves();

        // Update saves entries array
        this._saveEntries = SerializationUtils.getSavesEntries();

        // Update current selected save's index
        if(this._saveEntries.length < 1)
        {
            this._currentSaveIndex = -1;
        }
        else
        {
            const shouldResetIndex = this._currentSaveIndex > this._saveEntries.length - 1;
            this._currentSaveIndex = shouldResetIndex ? 0 : this._currentSaveIndex;
        }

        this._saveCount.text = 'Saves: ' + this._saveEntries.length;
        this._saveName.text = this._currentSaveIndex < 0 ?
            "No save available":
            this._saveEntries[this._currentSaveIndex].name;
    }

    // Saves manipulation
    // =============================

    private loadBlankSave(): void
    {
        this.setCurrentSelectedSave(-1);
        BuildController.loadBuild(this._currentBuildData.blocks);
    }

    private setCurrentSelectedSave(index: number): void
    {
        switch (index)
        {
            case -1: // No save
                this._currentBuildData = SerializationUtils.createNewSaveEntry(new Date().toLocaleString());
                break;

            default: // At least one save
                this._currentBuildData = this._saveEntries[index];
                break;
        }
    }
}