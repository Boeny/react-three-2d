import { Position } from '~/types';


export { Position };

export interface Moving {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
}

export interface IStore {
    moving: Moving;
    state: {
        position: Position;
    };
    setPosition: (p: Position, after?: (p: Position) => void) => void;
    updatePositionBy: (p: Position, after?: (p: Position) => void) => void;
    moveLeft: (v: boolean) => void;
    moveRight: (v: boolean) => void;
    moveUp: (v: boolean) => void;
    moveDown: (v: boolean) => void;
    isMoving: () => boolean;
}
