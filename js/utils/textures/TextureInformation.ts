import { Component, CustomParameter, Texture, Type } from "@wonderlandengine/api";


/**
 * Just a simple container that exists in the scene to reference
 * textures (albedo + normal) to be used with blocks spawned from
 * prefabs in the scene at runtime.
 * 
 * Each instance of this component should exists under an object
 * that hold a TextureInformationContainer component.
 */
export class TextureInformation extends Component
{
    static TypeName: string = "texture-information";
    static Properties: Record<string, CustomParameter> = {
        uid: {type: Type.String},
        albedo: {type: Type.Texture, default: null},
        normal: {type: Type.Texture, default: null}
    };

    private uid: string;
    private albedo: Texture;
    private normal: Texture;

    public get uniqueID(): string { return this.uid; }
    public get albedoTexture(): Texture { return this.albedo; }
    public get normalTexture(): Texture { return this.normal; }
}