import { IStore as IBodyStore } from '../body/types';


export { IBodyStore };

export interface Position {
    x: number;
    y: number;
}

export interface Colliders {
    [coo: string]: IBodyStore | undefined;
}

export interface IStore {
    state: { colliders: Colliders };
    add: (el: IBodyStore) => void;
    del: (position: Position) => void;
}
