import {SaveData, SceneBuildData} from "./SarielizationData";

const SAVE_ITEM_KEY = 'SAVE_DATA';

class SerializationUtils
{
    private _localStorage: Storage;
    private _saveData: SaveData;

    public constructor()
    {
        this._localStorage = window.localStorage;

        if(localStorage.getItem(SAVE_ITEM_KEY) !== null)
        {
            this.processExistingSaveData();
            return;
        }

        this.createSaveData();
    }

    private processExistingSaveData(): void
    {
        this._saveData = JSON.parse(this._localStorage.getItem(SAVE_ITEM_KEY)) as SaveData;
        console.log(this._saveData);
    }

    private createSaveData(): void
    {
        this._saveData = { saves: new Array<SceneBuildData> }
        this._localStorage.setItem(SAVE_ITEM_KEY, JSON.stringify(this._saveData));
    }
}

export default new SerializationUtils();