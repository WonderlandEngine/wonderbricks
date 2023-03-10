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
    private _texturesInformation: Array<TextureInformation>;

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
        this._texturesInformation = new Array<TextureInformation>(this._children.length);

        for (let i = 0; i < this._children.length; i++) 
        {
            const texInfo = this._children[i];
            this._texturesInformation[i] = texInfo.getComponent(TextureInformation);
        }

        console.log(`Found ${this._texturesInformation.length} textures`);
    }
}