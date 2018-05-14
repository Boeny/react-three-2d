import { Vector2 } from 'three';


export interface Position {
    x: number;
    y: number;
}

export interface IStore extends CommonParams {
    state: { color: string };
    position: Position;
    velocity: Vector2;
    setColor: (color: string) => void;
    setPosition: (v: Position) => void;
    update: (v: Vector2) => void;
}

export interface CommonParams {
    name?: string;
    hasCollider?: boolean;
    afterUpdate?: (v: Vector2) => void;
    onEveryTick?: (body: IStore) => void;
}
