import {Component, Object3D, MeshComponent, Material} from "@wonderlandengine/api";
import {property} from "@wonderlandengine/api/decorators.js";
import {vec3, quat2} from "gl-matrix";

/**
Very simple mesh particles system
Demostrates spawning of new objects with components
and a simple pooling pattern.
Use it and customize it for your own game.
*/

/** Use like this:
        this.object.getComponent('burst-mesh-particles').changeMaterial('newMaterial');
        this.object.getComponent('burst-mesh-particles').time = 0; //Reset timer that will hide particles
        this.object.getComponent('burst-mesh-particles').spawnObjLocation = this.object; //Spawned Location
        this.object.getComponent('burst-mesh-particles').spawn();
*/
export class MeshParticles extends Component {
    static TypeName = "burst-mesh-particles";

    @property.material()
    material: Material | null = null;

    @property.float(5)
    delay: number;

    @property.mesh()
    mesh: Object3D | null = null;

    @property.float(6)
    maxParticles: number;

    @property.float(1.8)
    initialSpeed: number;

    @property.float(0.02)
    particleScale: number;

    @property.object()
    spawnObjLocation: Object3D;

    @property.float(9.81)
    gravity: number;

    public time: number;
    private _count: number;
    private _objects: Object3D[];
    private _velocities: vec3[];

    init()
    {
        this.time = 0.0;
        this._count = 0;
    }

    start()
    {
        this._objects = [];
        this._velocities = [];

        this._objects = this.engine.scene.addObjects(this.maxParticles, null, this.maxParticles);

        for (let i = 0; i < this.maxParticles; ++i) {
            this._velocities.push([0, 0, 0]);
            let obj: Object3D = this._objects[i];
            obj.name = "particle" + this._count.toString();
            let mesh: any = obj.addComponent(MeshComponent);

            mesh.mesh = this.mesh;
            mesh.material = this.material;
            /* Most efficient way to hide the mesh */
            obj.scaleLocal([0, 0, 0]);
        }
    }

    changeMaterial(mat: Material)
    {
        /* Called to Change the Material of the Particles */
        for (let o of this._objects) {
            o.getComponent("mesh").material = mat;
        }
    }

    update(dt: number)
    {
        this.time += dt;
        /* Hide Spawned Particles after Delay Timer*/
        if (this.time > this.delay) {
            for (let i = 0; i < this.maxParticles; ++i) {
                let obj = this._objects[i];
                obj.scaleLocal([0.01, 0.01, 0.01]);
            }
            this.time -= this.delay;
        }
        /* Target for retrieving particles world locations */
        let origin: vec3 = [0, 0, 0];
        let distance: vec3 = [0, 0, 0];
        for (let i = 0; i < Math.min(this._count, this._objects.length); ++i) {
            /* Get translation first, as object.translate() will mark
             * the object as dirty, which will cause it to recalculate
             * obj.transformWorld on access. We want to avoid this and
             * have it be recalculated in batch at the end of frame
             * instead */
            quat2.getTranslation(origin, this._objects[i].getTransformWorld());

            /* Apply gravity */
            const vel = this._velocities[i];
            vel[1] -= this.gravity * dt;

            /* Check if particle would collide */
            if (origin[1] + vel[1] * dt <= this.particleScale && vel[1] <= 0) {
                /* Pseudo friction */
                const frict = 1 / (1 - vel[1]);
                vel[0] = frict * vel[0];
                vel[2] = frict * vel[2];

                /* Reflect */
                vel[1] = -0.6 * vel[1];
                if (vel[1] < 0.6) vel[1] = 0;
            }
        }

        for (let i = 0; i < Math.min(this._count, this._objects.length); ++i) {
            /* Apply velocity */
            vec3.scale(distance, this._velocities[i], dt);
            this._objects[i].translateLocal(distance);
        }
    }

    /** Spawn a particle */
    spawn(): void
    {
        console.log("function called");
        for (let i = 0; i < this.maxParticles; ++i) {
            let index = this._count % this.maxParticles;

            let obj = this._objects[index];
            obj.resetTransform();
            obj.scaleLocal([this.particleScale, this.particleScale, this.particleScale]);

            /* Activate component, otherwise it will not show up! */
            obj.getComponent("mesh").active = true;

            const origin: vec3 = [0, 2, 0];
            if (this.spawnObjLocation != null) {
                /* Added Spawn on Choosen Object Location instead of self if not null */
                quat2.getTranslation(origin, this.spawnObjLocation.getTransformWorld());
            } else {
                quat2.getTranslation(origin, this.object.getTransformWorld());
            }
            obj.translateLocal(origin);

            this._velocities[index][0] = Math.random() - 0.5;
            this._velocities[index][1] = Math.random();
            this._velocities[index][2] = Math.random() - 0.5;

            vec3.normalize(this._velocities[index], this._velocities[index]);
            vec3.scale(this._velocities[index], this._velocities[index], this.initialSpeed);

            this._count += 1;
        }
    }
}
