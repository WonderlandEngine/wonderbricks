import {BlockData, SaveData, SceneBuildData} from "./SarielizationData";

const SAVE_ITEM_KEY = 'SAVE_DATA';

class SerializationUtils
{
    private _localStorage: Storage;
    private _saveData: SaveData;

    public constructor()
    {
        if(typeof window === 'undefined' || !window.localStorage)
            return;

        this._localStorage = window.localStorage;

        if(this._localStorage.getItem(SAVE_ITEM_KEY) !== null)
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

    // Saves manipulation
    // =============================

    public getSavesEntries(): Array<SceneBuildData>
    {
        return this._saveData.saves;
    }

    public addNewSaveEntry(name: string): SceneBuildData
    {
        let temp: SceneBuildData = {
            name: name,
            userPref: {color: [1, 1, 1], block: ''},
            blocks: new Array<BlockData>()
        }

        this._saveData.saves.push(temp);
        return temp;
    }

    public updateSaveEntry(saveData: SceneBuildData): void
    {
        const saves = this._saveData.saves;
        for (let i = 0; i < saves.length; i++)
        {
            if(saves[i].name == saveData.name)
            {
                saves[i] = saveData;
                return;
            }
        }
    }

    public removeSaveEntry(saveData: SceneBuildData): void
    {
        const saves = this._saveData.saves;
        for (let i = 0; i < saves.length; i++)
        {
            if(saves[i].name == saveData.name)
            {
                saves.splice(i, 1);
                return;
            }
        }
    }

    public flushSaves(): void
    {
        this._localStorage.setItem(SAVE_ITEM_KEY, JSON.stringify(this._saveData));
    }
}

export default new SerializationUtils();