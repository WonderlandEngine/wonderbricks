import { Component, CustomParameter, Object } from "@wonderlandengine/api";
import { TextureInformation } from "./TextureInformation";


/**
 * Contains only objects that hold a TextureInformation component.
 * Only one instance by scene is optimal (but not mandatory... as long
 * as it fits the need).
 */
export class TextureInformationContainer extends Component
{
    static TypeName: string = "texture-information-container";
    static Properties: Record<string, CustomParameter> = {};

    private _children: Array<Object>;
    private _texturesInformation: Map<string, TextureInformation>;

    public override start(): void 
    {
        // We cache children on start in order to limite the call to the generation
        // of this array each time we need to access them
        this._children = this.object.children;

        // Gather all TextureInformation Components from children
        this.buildTexturesInformationArray();
    }

    private buildTexturesInformationArray(): void 
    {
        this._texturesInformation = new Map<string, TextureInformation>();

        for (let i = 0; i < this._children.length; i++) 
        {
            const child = this._children[i];
            const texInfo = child.getComponent(TextureInformation);
            this._texturesInformation.set(texInfo.uniqueID, texInfo);
        }

        console.log(`Found ${this._texturesInformation.size} textures`);
    }
}