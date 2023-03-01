import {quat, vec3, vec4} from "gl-matrix";


export type BlockData = {
    type: string,
    position: vec3,
    rotation: quat,
    color: vec4
};

export type UserPrefData = {
    color: vec3,
    block: string
};

export type SceneBuildData = {
    name: string,
    userPref: UserPrefData,
    blocks: Array<BlockData>
};

export type SaveData = {
    saves: Array<SceneBuildData>
}