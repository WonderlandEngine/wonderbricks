#include "lib/Compatibility.frag"

#define USE_VIEW_POSITION
#define USE_LIGHTS

#define FEATURE_TEXTURED
#define FEATURE_ALPHA_MASKED
#define FEATURE_SHADOW_NORMAL_OFFSET_SCALE_BY_SHADOW_DEPTH
#define FEATURE_SHADOW_NORMAL_OFFSET_UV_ONLY
#define FEATURE_SHADOW_NORMAL_OFFSET_SLOPE_SCALE
#define FEATURE_DEPRECATED_LIGHT_ATTENUATION

#define USE_MATERIAL_ID
#define USE_NORMAL

#if NUM_LIGHTS > 0
#define USE_POSITION_WORLD
#endif

#if NUM_SHADOWS > 0
#define USE_POSITION_VIEW
#endif

#include "lib/Uniforms.glsl"
#include "lib/Inputs.frag"

#if NUM_LIGHTS > 0
#include "lib/Quaternion.glsl"
#include "lib/Lights.frag"
#endif

#include "lib/Surface.frag"
#include "lib/Materials.frag"

struct Material {
    lowp vec4 ambientColor;
    lowp float shadowStrength;
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

    SurfaceData surface = computeSurfaceData(fragNormal);

    float shadowSum = 1.0;

    #if NUM_LIGHTS > 0
    mediump vec3 viewDir = normalize(fragPositionWorld - viewPositionWorld);

    lowp uint i = 0u;
    for(; i < numPointLights; ++i) {
        mediump vec4 lightData = lightColors[i];
        /* dot product of mediump vec3 can be NaN for distances > 128 */
        highp vec3 lightPos = lightPositionsWorld[i];
        highp vec3 lightDirAccurate = lightPos - fragPositionWorld;
        mediump float distSq = dot(lightDirAccurate, lightDirAccurate);
        mediump float attenuation = distanceAttenuation(distSq, lightData.a);

        if(attenuation < 0.001)
            continue;

        mediump vec3 lightDir = lightDirAccurate;
        lightDir *= inversesqrt(distSq);

        float shadow = 1.0;
        #if NUM_SHADOWS > 0
        /* Shadows */
        bool shadowsEnabled = bool(lightParameters[i].z);
        if(shadowsEnabled) {
            int shadowIndex = int(lightParameters[i].w) + int(dot(lightDir, lightDirectionsWorld[i]) < 0.0);
            shadow = sampleShadowParaboloid(shadowIndex);
        }
        #endif
        shadowSum *= shadow;
    }

    lowp uint endSpotLights = numPointLights + numSpotLights;
    for(; i < endSpotLights; ++i) {
        mediump vec4 lightData = lightColors[i];
        /* dot product of mediump vec3 can be NaN for distances > 128 */
        highp vec3 lightPos = lightPositionsWorld[i];
        highp vec3 lightDirAccurate = lightPos - fragPositionWorld;
        mediump float distSq = dot(lightDirAccurate, lightDirAccurate);
        mediump float attenuation = distanceAttenuation(distSq, lightData.a);

        if(attenuation < 0.001)
            continue;

        mediump vec3 lightDir = lightDirAccurate;
        lightDir *= inversesqrt(distSq);

        highp vec3 spotDir = lightDirectionsWorld[i];
        attenuation *= spotAttenuation(lightDir, spotDir, lightParameters[i].x, lightParameters[i].y);

        if(attenuation < 0.001)
            continue;

        float shadow = 1.0;
        #if NUM_SHADOWS > 0
        /* Shadows */
        bool shadowsEnabled = bool(lightParameters[i].z);
        if(shadowsEnabled) {
            int shadowIndex = int(lightParameters[i].w);
            shadow = sampleShadowPerspective(shadowIndex, surface.normal, lightDir);
        }
        #endif
        shadowSum *= shadow;
    }

    lowp uint endSunLights = numPointLights + numSpotLights + numSunLights;
    for(; i < endSunLights; ++i) {
        mediump vec4 lightData = lightColors[i];
        mediump vec3 lightDir = lightDirectionsWorld[i];

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
        shadowSum *= shadow;
    }

    #endif

    outColor.rgb = vec3(0, 0, 0);
    outColor.a = (1.0 - max(0.0, min(1.0, shadowSum)))*mat.shadowStrength;
}
