import { Vector2 } from 'three';


export interface Position {
    x: number;
    y: number;
}

export interface IStore {
    moving: {
        left: boolean;
        right: boolean;
        up: boolean;
        down: boolean;
    };
    position: Position;
    velocity: Position;
    init: (position: Vector2) => void;
    setPosition: (v: Position) => void;
    setVelocity: (v: Vector2) => void;
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
