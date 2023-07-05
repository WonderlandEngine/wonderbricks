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
export class CloudMeshParticles extends Component {
    static TypeName = "cloud-mesh-particles";

    @property.material()
    material: Material | null = null;

    @property.float(0.5)
    delay: number;

    @property.mesh()
    mesh: Object3D | null = null;

    @property.float(20)
    maxParticles: number;

    @property.float(0.6)
    initialSpeed: number;

    @property.float(0.08)
    particleScale: number;

    @property.object()
    spawnObjLocation: Object3D;

    @property.float(0.4)
    gravity: number;

    @property.float(0.04)
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
        this.origin = [ 0, 1, 0];
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
        const timeFraction = Math.min(this.time / this.delay, 1); // Ensure the fraction doesn't exceed 1

        /* Hide Spawned Particles after Delay Timer*/
        if (this.time > this.delay) {
            for (let i = 0; i < this.maxParticles; ++i) {
                //let obj = this._objects[i];
                //obj.scaleLocal([0.01, 0.01, 0.01]);
                this._fadeFlag= true;
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

            // Apply deceleration based on timeFraction
            const decelerationFactor = 1 - timeFraction * this.deceleration;
            vec3.scale(vel, vel, decelerationFactor);

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

            this._objects[i].rotateAxisAngleDegObject([0,0,1],this.getRandomNumber(90,1)*dt)  // * (max- min) + min
			this._objects[i].scaleLocal([this._randomScale, this._randomScale, 1])
			if(this._fadeFlag){
                //@ts-ignore
				var alpha = this._objects[i].getComponent(MeshComponent).material.color[3];
                //@ts-ignore
				if (alpha > 0) this._objects[i].getComponent(MeshComponent).material.color=[1,1,1,alpha*.9999999]
				//@ts-ignore
                else this._objects[i].getComponent(MeshComponent).material.color= [1,1,1,0]
				//console.log(this.objects[i].getComponent(MeshComponent).material.color[3])
			}
        }
    }

    getRandomNumber(max: number,min: number){
		var value = Math.random() * (max - min) + min
		var orientation = 1;
		const random = Math.random()
		if(random === 0 )orientation =  -1
		else orientation = 1;
		value *= orientation;
		return value ;
	}

    /** Spawn a particle */
    spawn(): void
    {
        for (let i = 0; i < this.maxParticles; ++i) {
            let index = this._count % this.maxParticles;

            this._fadeFlag=false;

            let obj = this._objects[index];
            //@ts-ignore
            obj.getComponent(MeshComponent).material.color= [1,1,1,1]
            obj.resetTransform();
            obj.scaleLocal([this.particleScale, this.particleScale, this.particleScale]);
            obj.rotateAxisAngleDegObject([1,0,0],90)

            /* Activate component, otherwise it will not show up! */
            obj.getComponent("mesh").active = true;

            
            if (this.spawnObjLocation != null) {
                /* Added Spawn on Choosen Object Location instead of self if not null */
                quat2.getTranslation(this.origin, this.spawnObjLocation.getTransformWorld());
            } else {
                quat2.getTranslation(this.origin, this.object.getTransformWorld());
            }
            obj.translateLocal(this.origin);

            this._velocities[index][0] = Math.random() - 0.5;
            this._velocities[index][1] = Math.random();
            this._velocities[index][2] = Math.random() - 0.5;

            vec3.normalize(this._velocities[index], this._velocities[index]);
            vec3.scale(this._velocities[index], this._velocities[index], this.initialSpeed);

            this._count += 1;
        }
    }
}
