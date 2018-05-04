import { Vector2 } from 'three';


export interface IStore {
    position: { x: number, y: number };
    velocity: Vector2;
    update: (v: Vector2) => void;
    name?: string;
}
