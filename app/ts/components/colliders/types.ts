import { IStore as IBodyStore } from '../body/types';


export { IBodyStore };

export interface Position {
    x: number;
    y: number;
}

export interface IStore {
    colliders: IBodyStore[];
    add: (el: IBodyStore) => void;
    del: (el: IBodyStore) => void;
}
