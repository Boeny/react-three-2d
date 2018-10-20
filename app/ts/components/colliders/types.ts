import { Position } from '~/types';
import { IStore as IBodyStore } from '../body/types';


export { IBodyStore };

export type Colliders = Coobject<IBodyStore>;

export interface IStore {
    state: { colliders: Colliders };
    add: (el: IBodyStore) => void;
    del: (position: Position) => void;
}
