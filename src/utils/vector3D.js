export class Vector3D {
	x = 0;
	y = 0;
	z = 0;

	constructor(x = 0, y = 0, z = 0) {

		this.set(x, y, z);
	}

	/**
	 * Returns a new Vector3D with the same values of this vector
	 * @returns {Vector3D}
	 */
	copy() {
		return new Vector3D(this.x, this.y, this.z);
	}

	toStr() {
        return 'Vector3D(' + this.x + ", " + this.y + ", " + this.z + ")";
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

	magnitude() {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
	}

	normalize() {
		this.x /= this.magnitude();
		this.y /= this.magnitude();
		this.z /= this.magnitude();

		return this;
	}

	static add_vecs(vec3d_a, vec3d_b) {
		return new Vector3D(vec3d_a.x + vec3d_b.x, vec3d_a.y + vec3d_b.y, vec3d_a.z + vec3d_b.z);
	}

	static sub_vecs(vec3d_a, vec3d_b) {
		return new Vector3D(vec3d_a.x - vec3d_b.x, vec3d_a.y - vec3d_b.y, vec3d_a.z - vec3d_b.z);
	}

	static distance(vec3d_a, vec3d_b) {
		let diffVec = this.sub_vecs(vec3d_a, vec3d_b);

		return Math.sqrt(Math.pow(diffVec.x, 2) + Math.pow(diffVec.y, 2) + Math.pow(diffVec.z, 2));
	}

	static zero() {
		return new Vector3D(0, 0, 0);
	}
}