import { Vector2 } from 'three';


export interface IStore extends CommonParams {
    position: { x: number, y: number };
    velocity: Vector2;
    update: (v: Vector2) => void;
    tail?: boolean;
}

export interface CommonParams {
    color: string;
    name?: string;
    afterUpdate?: (pos: Vector2) => void;
    onEveryTick?: () => void;
}
