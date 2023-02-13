import {Component, Type} from "@wonderlandengine/api";


export default class PointerRay extends Component
{
    static TypeName = 'pointer-ray';
    static Properties = {
        rayObject: {type: Type.Object},
        pointerObject: {type: Type.Object}
    }

    public override start()
    {

    }

    public override update(delta: number)
    {

    }
}