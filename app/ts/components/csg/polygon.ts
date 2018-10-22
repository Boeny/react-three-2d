import { Vertex } from './vertex';
import { EPSILON, COPLANAR, FRONT, BACK, SPANNING } from './constants';


export class Polygon {

    vertices: Vertex[] = [];
    normal: Vertex | null = null;
    w: number = 0;

    constructor(vertices?: Vertex[]) {
        if (vertices && vertices.length > 0) {
            this.vertices = vertices;
            this.calculateProperties();
        }
    }

    calculateProperties(): this {
        const a = this.vertices[0];
        const b = this.vertices[1];
        const c = this.vertices[2];
        this.normal = b.clone().sub(a)
            .cross(c.clone().sub(a))
            .normalize();
        this.w = this.normal.clone().dot(a);
        return this;
    }

    clone(): Polygon {
        const polygon = new Polygon();
        for (let i = 0; i < this.vertices.length; i += 1) {
            polygon.vertices.push(this.vertices[i].clone());
        }
        polygon.calculateProperties();
        return polygon;
    }

    flip(): this {
        if (this.normal === null) {
            return this;
        }
        const vertices = [];
        this.normal.multiplyScalar(-1);
        this.w *= -1;
        for (let i = this.vertices.length - 1; i >= 0; i -= 1) {
            vertices.push(this.vertices[i]);
        }
        this.vertices = vertices;
        return this;
    }

    classifyVertex(vertex: Vertex): 0 | 1 | 2 {
        if (this.normal === null) {
            return COPLANAR;
        }
        const sideValue = this.normal.dot(vertex) - this.w;
        if (sideValue < -EPSILON) {
            return BACK;
        }
        if (sideValue > EPSILON) {
            return FRONT;
        }
        return COPLANAR;
    }

    classifySide(polygon: Polygon): 0 | 1 | 2 | 3 {
        const { vertices } = polygon;
        let numPositive = 0;
        let numNegative = 0;
        for (let i = 0; i < vertices.length; i += 1) {
            const vertex = vertices[i];
            const classification = this.classifyVertex(vertex);
            if (classification === FRONT) {
                numPositive += 1;
            } else if (classification === BACK) {
                numNegative += 1;
            }
        }
        if (numPositive === vertices.length && numNegative === 0) {
            return FRONT;
        }
        if (numPositive === 0 && numNegative === vertices.length) {
            return BACK;
        }
        if (numPositive > 0 && numNegative > 0) {
            return SPANNING;
        }
        return COPLANAR;
    }

    splitPolygon(
        polygon: Polygon, coplanarFront: Polygon[], coplanarBack: Polygon[], front: Polygon[],
        back: Polygon[]
    ) {
        if (!this.normal) {
            return;
        }
        const classification = this.classifySide(polygon);
        if (classification === COPLANAR) {
            const polygons = polygon.normal && this.normal.dot(polygon.normal) > 0 ?
                coplanarFront : coplanarBack;
            polygons.push(polygon);
            return;
        }
        if (classification === FRONT) {
            front.push(polygon);
            return;
        }
        if (classification === BACK) {
            back.push(polygon);
            return;
        }
        const frontVertices = [];
        const backVertices = [];
        for (let i = 0; i < polygon.vertices.length; i += 1) {
            const vi = polygon.vertices[i];
            const vj = polygon.vertices[(i + 1) % polygon.vertices.length];
            const ti = this.classifyVertex(vi);
            const tj = this.classifyVertex(vj);
            if (ti !== BACK) {
                frontVertices.push(vi);
            }
            if (ti !== FRONT) {
                backVertices.push(vi);
            }
            if ((ti | tj) === SPANNING) {
                const result = vi.clone().lerp(
                    vj,
                    (this.w - this.normal.dot(vi)) / this.normal.dot(vj.clone().sub(vi))
                );
                frontVertices.push(result);
                backVertices.push(result);
            }
        }
        if (frontVertices.length >= 3) {
            front.push(new Polygon(frontVertices).calculateProperties());
        }
        if (backVertices.length >= 3) {
            back.push(new Polygon(backVertices).calculateProperties());
        }
    }
}
