// <reference path="./../../deploy/wonderland.min.js"/>

import {Component, Scene} from "@wonderlandengine/api";

export function registerComponent(component: Component): void
{
    // @ts-ignore
    WL.registerComponent(component);
}

export function getCurrentScene(): Scene
{
    // @ts-ignore
    return WL.scene;
}