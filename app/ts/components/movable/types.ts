import { IStore as IBodyStore } from '../body/types';

export { IBodyStore };
export type MovableStore = IBodyStore | { onEveryTick: () => void };

export interface IStore {
    bodies: MovableStore[];
    add: (el: MovableStore) => void;
    del: (el: MovableStore) => void;
    isBody: (el: MovableStore) => el is IBodyStore;
}
