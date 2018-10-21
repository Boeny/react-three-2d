import { Vector3, Vector2, Matrix4 } from 'three';


export class Vertex {

    position: Vector3;
    normal: Vector3;
    uv: Vector2;

    constructor(position: Vector3, normal: Vector3, uv: Vector2) {
        this.position = position;
        this.normal = normal;
        this.uv = uv;
    }

    clone(): Vertex {
        return new Vertex(this.position.clone(), this.normal.clone(), this.uv.clone());
    }

    add(vertex: Vertex): this {
        this.position.add(vertex.position);
        return this;
    }

    sub(vertex: Vertex): this {
        this.position.sub(vertex.position);
        return this;
    }

    multiplyScalar(scalar: number): this {
        this.position.multiplyScalar(scalar);
        return this;
    }

    cross(vertex: Vertex): this {
        this.position.cross(vertex.position);
        return this;
    }

    normalize(): this {
        this.position.normalize();
        return this;
    }

    dot(vertex: Vertex): number {
        return this.position.dot(vertex.position);
    }

    lerp(vertex: Vertex, scalar: number): this {
        this.add(vertex.clone().sub(this).multiplyScalar(scalar));
        this.normal.add(vertex.normal.clone().sub(this.normal).multiplyScalar(scalar));
        this.uv.add(vertex.uv.clone().sub(this.uv).multiplyScalar(scalar));
        return this;
    }

    applyMatrix4(matrix: Matrix4): this {
        // input: Matrix4 affine matrix
        const e = matrix.elements;
        this.position.x = e[0] * this.position.x + e[4] * this.position.y + e[8] * this.position.z + e[12];
        this.position.y = e[1] * this.position.x + e[5] * this.position.y + e[9] * this.position.z + e[13];
        this.position.z = e[2] * this.position.x + e[6] * this.position.y + e[10] * this.position.z + e[14];
        return this;
    }
}
