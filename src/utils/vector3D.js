export class Vector3D {
	x = 0;
	y = 0;
	z = 0;

	constructor(x = 0, y = 0, z = 0) {

		this.set(x, y, z);
	}

	set(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	setX(val) {
		this.x = val;
	}

	setY(val) {
		this.y = val;
	}

	setZ(val) {
		this.z = val;
	}

	add(vec3d) {
		this.x += vec3d.x;
		this.y += vec3d.y;
		this.z += vec3d.z;

		return this;
	}

	sub(vec3d) {
		this.x -= vec3d.x;
		this.y -= vec3d.y;
		this.z -= vec3d.z;

		return this;
	}

	static add_vecs(vec3d) {
		return new Vector3D(this.x + vec3d.x, this.y + vec3d.y, this.z + vec3d.z);
	}

	static sub_vecs(vec3d) {
		return new Vector3D(this.x - vec3d.x, this.y - vec3d.y, this.z - vec3d.z);
	}
}