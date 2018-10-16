import { Vector2 } from 'three';


export interface Moving {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
}

export interface IStore {
    moving: Moving;
    position: Position;
    init: (position: Vector2) => void;
    setPosition: (x: number, y: number) => void;
    moveLeft: (v: boolean) => void;
    moveRight: (v: boolean) => void;
    moveUp: (v: boolean) => void;
    moveDown: (v: boolean) => void;
    isMoving: () => boolean;
}
