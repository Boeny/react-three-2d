import { Polygon } from './polygon';
import { BACK } from './constants';


export class Node {

    polygons: Polygon[] = [];
    front: Node | null = null;
    back: Node | null = null;
    divider: Polygon | null = null;

    constructor(polygons?: Polygon[]) {
        if (polygons && polygons.length > 0) {
            this.build(polygons);
        }
    }

    isConvex(polygons: Polygon[]): boolean {
        for (let i = 0; i < polygons.length; i += 1) {
            for (let j = 0; j < polygons.length; j += 1) {
                if (i !== j && polygons[i].classifySide(polygons[j]) !== BACK) {
                    return false;
                }
            }
        }
        return true;
    }

    build(polygons: Polygon[]) {
        const front: Polygon[] = [];
        const back: Polygon[] = [];
        if (!this.divider) {
            this.divider = polygons[0].clone();
        }
        for (let i = 0; i < polygons.length; i += 1) {
            this.divider.splitPolygon(polygons[i], this.polygons, this.polygons, front, back);
        }
        if (front.length > 0 && !this.front) {
            this.front = new Node(front);
        }
        if (back.length > 0 && !this.back) {
            this.back = new Node(back);
        }
    }

    allPolygons(): Polygon[] {
        return [
            ...this.polygons,
            ...(this.front ? this.front.allPolygons() : []),
            ...(this.back ? this.back.allPolygons() : [])
        ];
    }

    clone(): Node {
        const node = new Node();
        node.divider = this.divider && this.divider.clone();
        node.polygons = this.polygons.map(p => p.clone());
        node.front = this.front && this.front.clone();
        node.back = this.back && this.back.clone();
        return node;
    }

    invert(): this {
        for (let i = 0; i < this.polygons.length; i += 1) {
            this.polygons[i].flip();
        }
        if (this.divider) {
            this.divider.flip();
        }
        if (this.front) {
            this.front.invert();
        }
        if (this.back) {
            this.back.invert();
        }
        const temp = this.front;
        this.front = this.back;
        this.back = temp;
        return this;
    }

    clipPolygons(polygons: Polygon[]): Polygon[] {
        if (!this.divider) {
            return polygons.slice();
        }
        let front: Polygon[] = [];
        let back: Polygon[] = [];
        for (let i = 0; i < this.polygons.length; i += 1) {
            this.divider.splitPolygon(polygons[i], front, back, front, back);
        }
        if (this.front) {
            front = this.front.clipPolygons(front);
        }
        if (this.back) {
            back = this.back.clipPolygons(back);
        } else {
            back = [];
        }
        return front.concat(back);
    }

    clipTo(node: Node) {
        this.polygons = node.clipPolygons(this.polygons);
        if (this.front) {
            this.front.clipTo(node);
        }
        if (this.back) {
            this.back.clipTo(node);
        }
    }
}
