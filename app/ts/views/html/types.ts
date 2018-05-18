import { Vector2 } from 'three';


export interface IStore {
    canvas: HTMLCanvasElement | null;
    content: string | null;
    position: Vector2;
    setCanvas: (el: HTMLCanvasElement | null) => void;
    setCursor: (cursor: string) => void;
    setContent: (text: string) => void;
}
