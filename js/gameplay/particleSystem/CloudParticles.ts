import {Component, Object3D, MeshComponent, Material, Mesh} from "@wonderlandengine/api";
import {property} from "@wonderlandengine/api/decorators.js";
import {vec3, quat2} from "gl-matrix";

const tempVec = new Float32Array(3);

export class CloudMeshParticles extends Component {
    static TypeName = "cloud-mesh-particles";

    @property.material()
    material: Material | null = null;

    @property.float(0.5)
    delay: number;

    @property.mesh()
    mesh: Mesh | null = null;

    @property.float(20)
    maxParticles: number;

    @property.float(0.6)
    initialSpeed: number;

    @property.float(0.08)
    particleScale: number;

    @property.object()
    spawnObjLocation: Object3D;

    @property.float(0.0)
    gravity: number;

    @property.float(0.35)
    deceleration: number;

    public time: number;
    private _count: number;
    private _objects: Object3D[];
    private _velocities: vec3[];
    private _randomScale: number;
    private _fadeFlag: Boolean;
    private origin: vec3;

    init()
    {
        this.time = 0.0;
        this._count = 0;
        this._randomScale = 1.001;
        this._fadeFlag = false;
        this.origin = [0, 1, 0];
    }

    start()
    {
        this._velocities = new Array(this.maxParticles);
        this._objects = this.engine.scene.addObjects(this.maxParticles, null, this.maxParticles);

        for (let i = 0; i < this.maxParticles; ++i)
        {
            this._velocities[i] = vec3.create();
            const obj = this._objects[i];
            obj.name = "particle" + this._count.toString();

            const mesh = obj.addComponent(MeshComponent)!;
            mesh.mesh = this.mesh;
            mesh.material = this.material;
            /* Most efficient way to hide the mesh */
            obj.scaleLocal([0, 0, 0]);
        }
    }

    onDestroy()
    {
        for (let i = 0; i < this.maxParticles; ++i)
        {
            const obj = this._objects[i];
            obj.destroy();
        }
    }

    changeMaterial(mat: Material)
    {
        /* Called to Change the Material of the Particles */
        for (let o of this._objects) {
            o.getComponent(MeshComponent).material = mat;
        }
    }

    update(dt: number)
    {
        this.time += dt;

        /* Hide Spawned Particles after Delay Timer*/
        if (this.time > this.delay)
        {
            for (let i = 0; i < this.maxParticles; ++i)
            {
                this._fadeFlag = true;
            }
            this.time -= this.delay;
        }

        /* Target for retrieving particles world locations */
        const origin = vec3.create();
        const distance = vec3.create();
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

            vec3.scale(vel, vel, 1 - dt*this.deceleration);

            /* Check if particle would collide */
            if (origin[1] + vel[1] * dt <= this.particleScale && vel[1] <= 0)
            {
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

            this._objects[i].rotateAxisAngleDegObject([0, 0, 1], 45*dt);
            this._objects[i].scaleLocal([this._randomScale, this._randomScale, 1]);
            if(this._fadeFlag)
            {
                //@ts-ignore
                const alpha = this._objects[i].getComponent(MeshComponent).material.color[3];
                //@ts-ignore
                if (alpha > 0) this._objects[i].getComponent(MeshComponent).material.color = [1, 1, 1, alpha*.9999999]
                //@ts-ignore
                else this._objects[i].getComponent(MeshComponent).material.color = [1, 1, 1, 0]
            }
        }
    }

    /** Spawn a particle */
    spawn(): void
    {
        for (let i = 0; i < this.maxParticles; ++i)
        {
            const index = this._count % this.maxParticles;

            this._fadeFlag = false;

            const obj = this._objects[index];
            //@ts-ignore
            obj.getComponent(MeshComponent).material.color = [1, 1, 1, 1]
            obj.resetTransform();

            const s = this.particleScale*(Math.random() + 0.5);
            obj.scaleLocal([s, s, s]);

            /* Activate component, otherwise it will not show up! */
            obj.getComponent("mesh").active = true;

            if (this.spawnObjLocation != null)
            {
                /* Added Spawn on Choosen Object Location instead of self if not null */
                quat2.getTranslation(this.origin, this.spawnObjLocation.getTransformWorld());
            }
            else
            {
                quat2.getTranslation(this.origin, this.object.getTransformWorld());
            }
            obj.translateLocal(this.origin);
            obj.lookAt(this.engine.scene.activeViews[0].object.getPositionWorld(tempVec))

            this._velocities[index][0] = Math.random() - 0.5;
            this._velocities[index][1] = 0.0;
            this._velocities[index][2] = Math.random() - 0.5;


            vec3.normalize(this._velocities[index], this._velocities[index]);
            vec3.scale(this._velocities[index], this._velocities[index], this.initialSpeed);

            this._count += 1;
        }
    }
}
