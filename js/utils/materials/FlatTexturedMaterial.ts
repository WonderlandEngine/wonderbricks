import { Material, Texture } from "@wonderlandengine/api";
import { vec4 } from "gl-matrix";


/**
 * Class declaration to manipulate Material that use 
 * Flat Opaque Textured Shader Pipeline.
 */
export declare class FlatTexturedMaterial extends Material
{
    public color: vec4;
    public flatTexture: Texture;
}