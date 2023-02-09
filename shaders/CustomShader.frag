#include "lib/Compatibility.frag"

/* With "shader features" you can let the editor know that this
 * shader supports toggleable variations.
 *
 * Any feature declaration needs to define a symbol like so:
 * #define FEATURE_<FeatureName>
 *
 * When you activate feature "FEATURE_FOO" in the editor,
 * it will define "FOO" such that you can check its presence */
#define FEATURE_TEXTURED

/* The shader may use optional features that supply it with
 * additional information */
// #define USE_VIEW_POSITION
// uniform highp vec3 viewPositionWorld;

// #define USE_LIGHTS
// #if NUM_LIGHTS > 0
// #include "lib/Lights.frag"
// #endif

/* To read vertex shader output, declare the desired values
 * here before including Inputs.frag. Only request the data
 * you really need for improved performance.
 * For a list of all values, check Inputs.frag. */

#ifdef TEXTURED
#define USE_TEXTURE_COORDS /* provides fragTextureCoords */
#endif
#define USE_MATERIAL_ID /* provides fragMaterialId */

#include "lib/Inputs.frag"

#ifdef TEXTURED
#include "lib/Textures.frag"
#endif

#include "lib/Materials.frag"

/* This structure is essential. Wonderland Editor will look
 * for it and parse the material properties to generate UI
 * from it.
 * If a uint property ends with "*Texture", it will be regarded
 * as a texture, only 2D textures are currently supported. */
struct Material {
    lowp vec4 color;
#ifdef TEXTURED
    mediump uint flatTexture;
    lowp float textureBlendFactor;
#endif
};

/* Wonderland Engine does some material packing magic and
 * automatically generates the matching unpacking code
 * if it finds this snippet in a shader. */
Material decodeMaterial(uint matIndex) {
    {{decoder}}
    return mat;
}

void main() {
    Material mat = decodeMaterial(fragMaterialId);
    #ifdef TEXTURED
    outColor = mix(
        textureAtlas(mat.flatTexture, fragTextureCoords),
        mat.color, mat.textureBlendFactor);
    #else
    outColor = mat.color;
    #endif
}
