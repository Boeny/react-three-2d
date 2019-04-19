import { Vector3 } from 'three';


export interface Sphere {
    radius: number;
    position: Vector3;
}

export interface IStore {
    data: Sphere[];
}
