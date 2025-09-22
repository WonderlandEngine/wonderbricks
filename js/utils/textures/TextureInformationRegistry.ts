import {TextureInformation} from './TextureInformation.js';

/**
 * Is used as registry for all Texture Information that leave in the
 * scene. It's usefull to fetch information.
 * Use the same system as prefabs.
 */
class TextureInformationRegistry {
    private _texturesInformation: Map<string, TextureInformation>;

    public get texturesUniqueID(): Array<string> {
        return Array.from(this._texturesInformation.keys());
    }

    public constructor() {
        this._texturesInformation = new Map<string, TextureInformation>();
    }

    public register(texInfo: TextureInformation): boolean {
        // Check if entry already exists
        if (this._texturesInformation.has(texInfo.uniqueID)) return false;

        this._texturesInformation.set(texInfo.uniqueID, texInfo);
        console.log('New Texture information registered ', texInfo.uniqueID);

        return true;
    }

    public getTextureInformation(uniqueID: string): TextureInformation {
        return this._texturesInformation.get(uniqueID);
    }
}

export default new TextureInformationRegistry();
