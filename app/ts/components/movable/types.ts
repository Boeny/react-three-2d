import { IStore as IBodyStore } from '../body/types';


export { IBodyStore };

export interface IStore {
    bodies: IBodyStore[];
    push: (el: IBodyStore) => void;
}
