import { Vector2 } from 'three';
import { Collider } from '../colliders/types';


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
    updateCollider?: () => void;
}

export interface CommonParams {
    name?: string;
    isMovable?: boolean;
    onEveryTick?: (body: IStore) => void;
    onPositionChange?: (v: Position) => void;
    onVelocityChange?: (v: Vector2) => void;
    onCollide?: (collider: Collider) => void;
    onUnCollide?: () => void;
}
