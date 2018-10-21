import { Matrix4, Geometry, Mesh, Vector3, Vector2, Face3, Face4, Material } from 'three';
import { Polygon } from './polygon';
import { Vertex } from './vertex';
import { Node } from './node';


export class ThreeBSP {

    matrix: Matrix4;
    tree: Node;

    constructor(g: Node | Geometry | Mesh) {
        if (g instanceof Node) {
            this.tree = g;
            this.matrix = new Matrix4();
            return this;
        }
        let geometry = g;
        // Convert Geometry to ThreeBSP
        if (geometry instanceof Geometry) {
            this.matrix = new Matrix4();
        }
        if (geometry instanceof Mesh) {
            // #todo: add hierarchy support
            geometry.updateMatrix();
            this.matrix = geometry.matrix.clone();
            geometry = geometry.geometry as Geometry;
        }
        const polygons: Polygon[] = [];
        for (let i = 0; i < geometry.faces.length; i += 1) {
            const face = geometry.faces[i];
            const faceVertexUvs = geometry.faceVertexUvs[0][i];
            const polygon = new Polygon();
            if (face instanceof Face3) {
                this.addVertex(geometry.vertices[face.a], polygon, face.vertexNormals[0], faceVertexUvs);
                this.addVertex(geometry.vertices[face.b], polygon, face.vertexNormals[1], faceVertexUvs);
                this.addVertex(geometry.vertices[face.c], polygon, face.vertexNormals[2], faceVertexUvs);
            }
            if (face instanceof Face4) {
                this.addVertex(geometry.vertices[face.a], polygon, face.vertexNormals[0], faceVertexUvs);
                this.addVertex(geometry.vertices[face.b], polygon, face.vertexNormals[1], faceVertexUvs);
                this.addVertex(geometry.vertices[face.c], polygon, face.vertexNormals[2], faceVertexUvs);
                this.addVertex(geometry.vertices[(face as any as { d:number }).d], polygon, face.vertexNormals[3], faceVertexUvs);
            }
            polygon.calculateProperties();
            polygons.push(polygon);
        }
        this.tree = new Node(polygons);
    }

    addVertex(v: Vector3, polygon: Polygon, normal: Vector3, faceVertexUvs: Vector2[]) {
        const vertex = new Vertex(
            v,
            normal,
            faceVertexUvs ? new Vector2(faceVertexUvs[3].x, faceVertexUvs[3].y) : new Vector2()
        );
        vertex.applyMatrix4(this.matrix);
        polygon.vertices.push(vertex);
    }

    subtract(otherTree: { tree: Node }): ThreeBSP {
        const a = this.tree.clone();
        const b = otherTree.tree.clone();
        a.invert();
        a.clipTo(b);
        b.clipTo(a);
        b.invert();
        b.clipTo(a);
        b.invert();
        a.build(b.allPolygons());
        a.invert();
        const newA = new ThreeBSP(a);
        newA.matrix = this.matrix;
        return newA;
    }

    union(otherTree: { tree: Node }): ThreeBSP {
        const a = this.tree.clone();
        const b = otherTree.tree.clone();
        a.clipTo(b);
        b.clipTo(a);
        b.invert();
        b.clipTo(a);
        b.invert();
        a.build(b.allPolygons());
        const newA = new ThreeBSP(a);
        newA.matrix = this.matrix;
        return newA;
    }

    intersect(otherTree: { tree: Node }): ThreeBSP {
        const a = this.tree.clone();
        const b = otherTree.tree.clone();
        a.invert();
        b.clipTo(a);
        b.invert();
        a.clipTo(b);
        b.clipTo(a);
        a.build(b.allPolygons());
        a.invert();
        const newA = new ThreeBSP(a);
        newA.matrix = this.matrix;
        return newA;
    }

    getVertexIdx(
        vertex: Vertex, matrix: Matrix4, geometry: Geometry, verticesDict: { [coo: string]: number }
    ): number {
        const position = vertex.position.clone();
        position.applyMatrix4(matrix);
        const coo = `${position.x},${position.y},${position.z}`;
        if (verticesDict[coo]) {
            return verticesDict[coo];
        }
        geometry.vertices.push(position);
        verticesDict[coo] = geometry.vertices.length - 1;
        return geometry.vertices.length - 1;
    }

    toGeometry(): Geometry {
        const matrix = new Matrix4().getInverse(this.matrix);
        const geometry = new Geometry();
        const polygons = this.tree.allPolygons();
        const verticesDict: { [coo: string]: number } = {};
        for (let i = 0; i < polygons.length; i += 1) {
            const polygon = polygons[i];
            if (!polygon.normal) {
                continue;
            }
            for (let j = 2; j < polygon.vertices.length; j += 1) {
                geometry.faces.push(new Face3(
                    this.getVertexIdx(polygon.vertices[0], matrix, geometry, verticesDict),
                    this.getVertexIdx(polygon.vertices[j - 1], matrix, geometry, verticesDict),
                    this.getVertexIdx(polygon.vertices[j], matrix, geometry, verticesDict),
                    polygon.normal.position.clone()
                ));
                geometry.faceVertexUvs[0].push([
                    polygon.vertices[0].uv.clone(),
                    polygon.vertices[j - 1].uv.clone(),
                    polygon.vertices[j].uv.clone()
                ]);
            }

        }
        return geometry;
    }

    toMesh(material: Material): Mesh {
        const mesh = new Mesh(this.toGeometry(), material);
        mesh.position.setFromMatrixPosition(this.matrix);
        mesh.rotation.setFromRotationMatrix(this.matrix);
        return mesh;
    }
}
