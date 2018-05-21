import { Vector2 } from 'three';
import { IStore as IBodyStore } from '../body/types';


export { IBodyStore };

export interface Position {
    x: number;
    y: number;
}

export interface ReducedStore {
    state: { color: string };
    name?: string;
    position?: Position;
    velocity?: Vector2;
    isMovable?: boolean;
}

export interface IStore {
    colliders: Collider[];
    add: (el: Collider) => void;
    del: (el: Collider) => void;
}

export interface Collider {
    position: Position;
    store: ReducedStore;
}
