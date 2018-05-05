import { Vector2 } from 'three';


export interface IStore {
    position: { x: number, y: number };
    velocity: Vector2;
    color: string;
    update: (v: Vector2) => void;
    name?: string;
    afterUpdate?: (pos: Vector2) => void;
}
