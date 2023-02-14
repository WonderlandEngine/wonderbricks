import {Component} from "@wonderlandengine/api";
import {Constructor, CustomParameter} from "@wonderlandengine/api/wonderland";

export type PrefabBaseConstructor<T extends Component> = Constructor<T> & {
    TypeName: string;
    Properties: Record<string, CustomParameter>;
};

export default abstract class PrefabBase extends Component
{
    static TypeName = '';
    static Properties = {};

    public constructor() {
        super();
    }

    public abstract getPrefabUniqueName(): string;
}