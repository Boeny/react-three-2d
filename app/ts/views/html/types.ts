import { Position } from '~/types';


interface State {
    position: Position;
    content: string | JSX.Element | null;
    windowWidth: number;
    windowHeight: number;
}

export interface IStore {
    canvas: HTMLCanvasElement | null;
    state: State;
    setCanvas: (el: HTMLCanvasElement | null) => void;
    setCursor: (cursor: string) => void;
    setContent: (text: string | JSX.Element | null) => void;
    setSize: () => void;
}
