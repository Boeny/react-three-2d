import { Vector3, Vector2 } from 'three';


export interface IStore {
    zoom: number;
    DOM: any;
    position: Vector3;
    speed: Vector2;
}
