import { IStore as IBodyStore } from '../body/types';


export interface IStore {
    moveLeft: () => void;
    moveRight: () => void;
    moveUp: () => void;
    moveDown: () => void;
    stopX: () => void;
    stopY: () => void;
    instance?: IBodyStore;
}
