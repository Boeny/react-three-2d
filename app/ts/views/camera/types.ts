import { Vector3, Vector2 } from 'three';

export interface State {
    zoom: number;
    position: Vector3;
}

export interface IStore {
    state: State;
    DOM: any;
    speed: Vector2 | null;
}
