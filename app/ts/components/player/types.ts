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
    setPosition: (v: Position) => void;
    setVelocity: (v: number, coo: 'x' | 'y') => void;
    moveLeft: () => void;
    moveRight: () => void;
    moveUp: () => void;
    moveDown: () => void;
    stopX: () => void;
    stopY: () => void;
    stopMovingLeft: () => void;
    stopMovingRight: () => void;
    stopMovingUp: () => void;
    stopMovingDown: () => void;
}
