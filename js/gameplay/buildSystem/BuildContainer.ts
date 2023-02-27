import {Component} from "@wonderlandengine/api";
import BuildController from "./BuildController";


export default class BuildContainer extends Component
{
    static TypeName = 'build-container';
    static Properties = {};

    public override init()
    {
        // Auto reference as build container to build controller
        BuildController.setBuildContainer(this.object);
    }
}