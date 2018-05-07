import { Vector2 } from 'three';


export interface IStore {
    canvas: HTMLCanvasElement | null;
    content: string | null;
    position: Vector2;
    setCanvas: (el: HTMLCanvasElement | null) => void;
    setCursor: (cursor: string) => void;
    setContent: (store: ConnectedStore | null) => void;
}

export interface ConnectedStore {
    position: Vector2;
    name?: string;
}
