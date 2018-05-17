import { Vector2 } from 'three';


export interface Position {
    x: number;
    y: number;
}

export interface IStore {
    colliders: Data[];
    add: (el: Data) => void;
    del: (el: Data) => void;
}

export interface Collider extends Data {
    position: Position;
    velocity: Vector2;
    isMovable?: boolean;
}

export interface Data {
    state: { color: string };
    name?: string;
}
