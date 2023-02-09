// <reference path="./../../deploy/wonderland.min.js"/>

import {Component} from "@wonderlandengine/api";

export function registerComponent(component: Component): void
{
    // @ts-ignore
    WL.registerComponent(component);
}