import { Vector2 } from 'three';
import { IBodyStore } from '../colliders/types';


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
    changePosition: (v: Vector2, withCollider?: boolean) => void;
    changeColliderPosition?: (v: Vector2) => void;
}

export interface CommonParams {
    name?: string | JSX.Element;
    isMovable?: boolean;
    onEveryTick?: (body: IStore) => void;
    onPositionChange?: (v: Position) => void;
    onVelocityChange?: (v: Vector2) => void;
    onCollide?: (collider: IBodyStore) => void;
    onUnCollide?: () => void;
}
