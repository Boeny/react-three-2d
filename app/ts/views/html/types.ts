import { Position } from '~/types';


export interface IStore {
    canvas: HTMLCanvasElement | null;
    state: {
        position: Position;
        content: string | JSX.Element | null;
    };
    setCanvas: (el: HTMLCanvasElement | null) => void;
    setCursor: (cursor: string) => void;
    setContent: (text: string | JSX.Element | null) => void;
}
