

export { IStore as IBodyStore } from '../body/types';

export interface IStore {
    colliders: {
        name: string;
        color: string;
    }[];
}
