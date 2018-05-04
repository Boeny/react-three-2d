import { Vector3, Vector2, OrthographicCamera } from 'three';

export interface State {
    zoom: number;
    position: Vector3;
}

export interface IStore {
    state: State;
    DOM: OrthographicCamera | null;
    speed: Vector2 | null;
    setCamera: (el: any) => void;
    setSpeed: (v: Vector2 | null) => void;
    decreaseSpeed: () => void;
}
