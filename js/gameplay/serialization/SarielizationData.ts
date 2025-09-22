import {quat, vec3} from 'gl-matrix';

export type BlockData = {
    type: string;
    position: vec3;
    rotation: Float32Array;
    texture: string;
};

export type UserPrefData = {
    color: vec3;
    block: string;
};

export type SceneBuildData = {
    name: string;
    userPref: UserPrefData;
    blocks: Array<BlockData>;
};

export type SaveData = {
    saves: Array<SceneBuildData>;
};
