import { Vector2 } from 'three';


export interface IStore {
    moving: {
        left: boolean;
        right: boolean;
        up: boolean;
        down: boolean;
    };
    position: { x: number, y: number };
    velocity: { x: number, y: number };
    init: (position: Vector2) => void;
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
