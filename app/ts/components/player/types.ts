import { IStore as IBodyStore } from '../body/types';


export interface IStore {
    isMovingLeft: boolean;
    isMovingRight: boolean;
    isMovingUp: boolean;
    isMovingDown: boolean;
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
    instance?: IBodyStore;
}
