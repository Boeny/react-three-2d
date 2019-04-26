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

export type Direction = VertDirection & HorDirection;

export interface State {
    position: Position;
    rotation: number;
}

export interface IStore {
    moving: Direction;
    rotating: HorDirection;
    velocity: Vector2;
    rotSpeed: number;
    state: State;
    setPosition: (p: Position, after?: (p: Position) => void) => void;
    rotateLeft: (v: boolean) => void;
    rotateRight: (v: boolean) => void;
    moveForward: (v: boolean) => void;
    moveBack: (v: boolean) => void;
    moveLeft: (v: boolean) => void;
    moveRight: (v: boolean) => void;
    isMoving: () => boolean;
    isRotating: () => boolean;
}
