import { Vector2 } from 'three';
import { Position } from '~/types';


export { Position };

export interface HorDirection {
    left: boolean;
    right: boolean;
}

export interface VertDirection {
    up: boolean;
    down: boolean;
}

export interface IStore {
    moving: VertDirection;
    rotating: HorDirection;
    velocity: Vector2;
    rotSpeed: number;
    state: {
        position: Position;
        rotation: number;
    };
    setPosition: (p: Position, after?: (p: Position) => void) => void;
    setRotation: (v: number) => void;
    rotateLeft: (v: boolean) => void;
    rotateRight: (v: boolean) => void;
    moveForward: (v: boolean) => void;
    moveBack: (v: boolean) => void;
    isMoving: () => boolean;
    isRotating: () => boolean;
}
