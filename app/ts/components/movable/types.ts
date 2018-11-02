import { State } from '../player/types';


export interface MovableStore {
    name?: string;
    state?: State;
    onEveryTick: (deltaTime: number) => void;
}

export interface IStore {
    data: MovableStore[];
    add: (el: MovableStore) => void;
    del: (el: MovableStore) => void;
}
