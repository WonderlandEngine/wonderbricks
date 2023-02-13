import {Component, Mesh, MeshComponent, Object, Type} from "@wonderlandengine/api";
import {getCurrentScene} from "../../lib/WlApi";
import Grid from "./Grid";


export default class GridDebugComponent extends Component
{
    static TypeName = 'grid-debug-component';
    static Properties = {
        debugVisualObject: {type: Type.Object, default: null}
    }

    private debugVisualObject: Object;
    private _grid: Grid;

    public override start()
    {
        this._grid = new Grid(2, 10, 0.5);
        let mesh = this.debugVisualObject.getComponent('mesh');
        let scene = getCurrentScene();

        let offset = 25.0 / 2;

        for (let y = 0; y < this._grid.layerCount; ++y)
            for (let x = 0; x < this._grid.gridSize; ++x)
                for (let z = 0; z < this._grid.gridSize; ++z)
                {
                    let tmp = scene.addObject(this.object);
                    tmp.addComponent('mesh', {
                        mesh: mesh.mesh,
                        material: mesh.material
                    });

                    tmp.resetTranslation();
                    tmp.translate(this._grid.getCellPosition(x, y, z));
                    let cellSize = this._grid.cellSize;
                    tmp.scale([cellSize, cellSize, cellSize]);
                }
    }
}