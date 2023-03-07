#include "lib/Compatibility.frag"

#define USE_VIEW_POSITION
#define USE_LIGHTS

#define FEATURE_WITH_FOG
#define FEATURE_TEXTURED
#define FEATURE_ALPHA_MASKED
#define FEATURE_NORMAL_MAPPING
#define FEATURE_VERTEX_COLORS
#define FEATURE_WITH_EMISSIVE
#define FEATURE_LIGHTMAP
#define FEATURE_SHADOW_NORMAL_OFFSET_SCALE_BY_SHADOW_DEPTH
#define FEATURE_SHADOW_NORMAL_OFFSET_UV_ONLY
#define FEATURE_SHADOW_NORMAL_OFFSET_SLOPE_SCALE

#ifdef NORMAL_MAPPING
#define TEXTURED
#endif

#define USE_NORMAL
#define USE_MATERIAL_ID
#ifdef TEXTURED
#define USE_TEXTURE_COORDS
#endif
#ifdef NORMAL_MAPPING
#define USE_TANGENT
#endif

#ifdef LIGHTMAP
#define USE_TEXTURE_COORDS_1
#endif

#ifdef VERTEX_COLORS
#define USE_COLOR
#endif

#if NUM_LIGHTS > 0
#define USE_POSITION_WORLD
#endif

#if NUM_SHADOWS > 0
#define USE_POSITION_VIEW
#endif

#include "lib/Inputs.frag"

#if NUM_LIGHTS > 0
#include "lib/Quaternion.glsl"
#include "lib/Lights.frag"
#endif

#ifdef TEXTURED
#include "lib/Textures.frag"
#endif
#include "lib/Surface.frag"
#include "lib/Materials.frag"

struct Material {
    lowp vec4 ambientColor;
    lowp vec4 diffuseColor;
    lowp vec4 specularColor;
#ifdef WITH_EMISSIVE
    lowp vec4 emissiveColor;
#endif

#ifdef WITH_FOG
    lowp vec4 fogColor;
#endif

#ifdef TEXTURED
    mediump uint diffuseTexture;
#ifdef WITH_EMISSIVE
    mediump uint emissiveTexture;
#endif
#ifdef NORMAL_MAPPING
    mediump uint normalTexture;
#endif
#ifdef LIGHTMAP
    mediump uint lightmapTexture;
    lowp float lightmapFactor;
#endif
#endif

    lowp uint shininess;
    lowp float ambientFactor;
};

Material decodeMaterial(uint matIndex) {
    {{decoder}}
    return mat;
}

#ifdef WITH_FOG
float fogFactorExp2(float dist, float density) {
    const float LOG2 = -1.442695;
    float d = density * dist;
    return 1.0 - clamp(exp2(d*d*LOG2), 0.0, 1.0);
}
#endif

mediump float phongDiffuseBrdf(mediump vec3 lightDir, mediump vec3 normal) {
    return max(0.0, dot(lightDir, normal));
}

mediump float phongSpecularBrdf(mediump vec3 lightDir, mediump vec3 normal, mediump vec3 viewDir, mediump float shininess) {
    mediump vec3 reflection = reflect(lightDir, normal);
    return pow(max(dot(viewDir, reflection), 0.0), shininess);
}

void main() {
    #ifdef TEXTURED
    alphaMask(fragMaterialId, fragTextureCoords);
    #endif

    Material mat = decodeMaterial(fragMaterialId);

    #ifdef TEXTURED
    lowp vec4 finalDiffuseColor =
        #ifdef VERTEX_COLORS
        vec4(fragColor.rgb, 1.0) +
        #endif
        textureAtlas(mat.diffuseTexture, fragTextureCoords);
    #else
    lowp vec4 finalDiffuseColor =
        #ifdef VERTEX_COLORS
        vec4(fragColor.rgb, 1.0) +
        #endif
        mat.diffuseColor;
    #endif

    lowp vec4 finalAmbientColor =
        mat.ambientColor + finalDiffuseColor*mat.ambientFactor;
    lowp vec4 finalSpecularColor = mat.specularColor;
    finalSpecularColor.rgb *= finalSpecularColor.a;

    #ifdef TEXTURED
    #ifdef LIGHTMAP
    lowp vec4 lightmap =
        textureAtlas(mat.lightmapTexture, fragTextureCoords1)*mat.lightmapFactor;
    finalAmbientColor.rgb += lightmap.rgb;
    #endif
    #endif

    /* Ambient color */
    outColor.rgb = finalAmbientColor.rgb;
    outColor.a = finalDiffuseColor.a;

    mediump float shininess = float(mat.shininess);

    /* Normal */
    #ifdef NORMAL_MAPPING
    SurfaceData surface = computeSurfaceData(fragNormal, fragTangent);
    mediump vec3 normal = normalMapping(surface, mat.normalTexture);
    #else
    SurfaceData surface = computeSurfaceData(fragNormal);
    mediump vec3 normal = surface.normal;
    #endif

    #if NUM_LIGHTS > 0
    mediump vec3 viewDir = normalize(fragPositionWorld - viewPositionWorld);
    bool useSpecular = finalSpecularColor.a != 0.0 && shininess != 0.0;

    lowp uint i = 0u;
    for(; i < numPointLights; ++i) {
        lowp vec4 lightData = lightColors[i];
        /* dot product of mediump vec3 can be NaN for distances > 128 */
        highp vec3 lightPos = lightPositionsWorld[i];
        highp vec3 lightDirAccurate = lightPos - fragPositionWorld;
        mediump float distSq = dot(lightDirAccurate, lightDirAccurate);
        mediump float attenuation = 1.0/(1.0 + lightData.a*distSq);

        if(attenuation < 0.001)
            continue;

        mediump vec3 lightDir = lightDirAccurate;
        lightDir *= inversesqrt(distSq);

        /* Add diffuse color */
        mediump vec3 value = finalDiffuseColor.rgb * phongDiffuseBrdf(lightDir, normal);
        /* Add specular color */
        if(useSpecular) {
            value += finalSpecularColor.rgb*
                phongSpecularBrdf(lightDir, normal, viewDir, shininess);
        }
        float shadow = 1.0;
        #if NUM_SHADOWS > 0
        /* Shadows */
        bool shadowsEnabled = bool(lightParameters[i].z);
        if(shadowsEnabled) {
            int shadowIndex = int(lightParameters[i].w) + int(dot(lightDir, lightDirectionsWorld[i]) < 0.0);
            shadow = sampleShadowParaboloid(shadowIndex);
        }
        #endif
        outColor.rgb += attenuation*value*lightData.rgb*shadow;
    }

    lowp uint endSpotLights = numPointLights + numSpotLights;
    for(; i < endSpotLights; ++i) {
        lowp vec4 lightData = lightColors[i];
        /* dot product of mediump vec3 can be NaN for distances > 128 */
        highp vec3 lightPos = lightPositionsWorld[i];
        highp vec3 lightDirAccurate = lightPos - fragPositionWorld;
        mediump float distSq = dot(lightDirAccurate, lightDirAccurate);
        mediump float attenuation = 1.0/(1.0 + lightData.a*distSq);

        if(attenuation < 0.001)
            continue;

        mediump vec3 lightDir = lightDirAccurate;
        lightDir *= inversesqrt(distSq);

        highp vec3 spotDir = lightDirectionsWorld[i];
        attenuation *= spotAttenuation(lightDir, spotDir, lightParameters[i].x, lightParameters[i].y);

        if(attenuation < 0.001)
            continue;

        /* Add diffuse color */
        mediump vec3 value = finalDiffuseColor.rgb*phongDiffuseBrdf(lightDir, normal);
        /* Add specular color */
        if(useSpecular) {
            value += finalSpecularColor.rgb*
                phongSpecularBrdf(lightDir, normal, viewDir, shininess);
        }
        float shadow = 1.0;
        #if NUM_SHADOWS > 0
        /* Shadows */
        bool shadowsEnabled = bool(lightParameters[i].z);
        if(shadowsEnabled) {
            int shadowIndex = int(lightParameters[i].w);
            shadow = sampleShadowPerspective(shadowIndex, surface.normal, lightDir);
        }
        #endif
        outColor.rgb += attenuation*value*lightData.rgb*shadow;
    }

    lowp uint endSunLights = numPointLights + numSpotLights + numSunLights;
    for(; i < endSunLights; ++i) {
        lowp vec3 lightColor = lightColors[i].rgb;
        mediump vec3 lightDir = lightDirectionsWorld[i];

        /* Add diffuse color */
        mediump vec3 value = finalDiffuseColor.rgb*
            phongDiffuseBrdf(lightDir, normal);
        /* Add specular color */
        if(useSpecular) {
            value += finalSpecularColor.rgb*
                phongSpecularBrdf(lightDir, normal, viewDir, shininess);
        }
        float shadow = 1.0;
        #if NUM_SHADOWS > 0
        /* Shadows */
        bool shadowsEnabled = bool(lightParameters[i].z);
        if(shadowsEnabled) {
            int shadowIndex = int(lightParameters[i].w);
            float depth = -fragPositionView.z;
            int cascade = selectCascade(shadowIndex, depth);
            if(cascade != -1)
                shadow = sampleShadowOrtho(shadowIndex + cascade, surface.normal, lightDir);
        }
        #endif
        outColor.rgb += value*lightColor*shadow;
    }

    outColor.rgb *= mat.diffuseColor.rgb;

    #endif

    #ifdef WITH_EMISSIVE
    vec4 emissive = mat.emissiveColor;
    #ifdef TEXTURED
    if(mat.emissiveTexture != 0u) {
        emissive *= textureAtlas(mat.emissiveTexture, fragTextureCoords);
    }
    #endif
    outColor.rgb += emissive.a*emissive.rgb;
    #endif

    #ifdef WITH_FOG
    float dist = gl_FragCoord.z/gl_FragCoord.w;
    float fogFactor = fogFactorExp2(dist, mat.fogColor.a*0.2);
    outColor.rgb = mix(outColor.xyz, mat.fogColor.rgb, fogFactor);
    #endif
}
