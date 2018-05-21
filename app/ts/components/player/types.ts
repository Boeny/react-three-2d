import { Vector2 } from 'three';


export interface Position {
    x: number;
    y: number;
}

export interface Moving {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
}

export interface IStore {
    moving: Moving;
    position: Position;
    velocity: Position;
    init: (position: Vector2) => void;
    setPosition: (x: number, y: number) => void;
    setVelocity: (v: number, coo: 'x' | 'y') => void;
    moveLeft: (v: boolean) => void;
    moveRight: (v: boolean) => void;
    moveUp: (v: boolean) => void;
    moveDown: (v: boolean) => void;
    stopX: () => void;
    stopY: () => void;
    stopMovingLeft: () => void;
    stopMovingRight: () => void;
    stopMovingUp: () => void;
    stopMovingDown: () => void;
}
