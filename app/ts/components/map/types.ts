import { Position3 } from '~/types';


export interface Sphere {
    radius: number;
    position: Position3;
}

export interface IStore {
    data: Sphere[];
}
