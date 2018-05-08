import { IStore as IBodyStore } from '../body/types';


export { IBodyStore };

export interface IStore {
    bodies: IBodyStore[];
    add: (el: IBodyStore) => void;
}
