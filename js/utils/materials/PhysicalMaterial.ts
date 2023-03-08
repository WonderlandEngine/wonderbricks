import { Material, Texture } from "@wonderlandengine/api";
import { vec4 } from "gl-matrix";


export declare class PhysicalMaterial extends Material
{
    // Other uniforms
    public albedoColor: vec4;
    public metallicFactor: number;
    public roughnessFactor: number;

    // General textures
    public albedoTexture: Texture;
    public roughnessMetallicTexture: Texture;
    public normalTexture: Texture;

    // Occlusion
    public occlusionTexture: Texture;
    public occlusionFactor: number;

    // GI specific textures
    public irradianceProbeTexture: Texture;
    public specularProbeTexture: Texture;
}