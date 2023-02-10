// <reference path="./../../deploy/wonderland.min.js"/>

import {Component, Scene, XrSessionStartCallback} from "@wonderlandengine/api";

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

export function getXrSessionStart(): Array<XrSessionStartCallback>
{
    // @ts-ignore
    return WL.onXRSessionStart;
}