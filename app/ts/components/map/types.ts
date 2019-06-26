import { Object3D } from 'three';
import { Position3 } from '~/types';


export interface Sphere {
    radius: number;
    position: Position3;
}

export interface IStore {
    data: Sphere[];
    selected: Object3D | null;
}
