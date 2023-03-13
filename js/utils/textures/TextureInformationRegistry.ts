import { Component, CustomParameter, Object } from "@wonderlandengine/api";
import { TextureInformation } from "./TextureInformation";


/**
 * Contains only objects that hold a TextureInformation component.
 * Only one instance by scene is optimal (but not mandatory... as long
 * as it fits the need).
 */
class TextureInformationRegistry
{
    static TypeName: string = "texture-information-container";
    static Properties: Record<string, CustomParameter> = {};

    private _children: Array<Object>;
    private _texturesInformation: Map<string, TextureInformation>;

    public constructor()
    {
        this._texturesInformation = new Map<string, TextureInformation>();
    }

    public register(texInfo: TextureInformation): boolean 
    {
        // Check if entry already exists
        if(this._texturesInformation.has(texInfo.uniqueID))
            return false;

        this._texturesInformation.set(texInfo.uniqueID, texInfo);
        return true;
    }
}

export default new TextureInformationRegistry();