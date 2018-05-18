

interface Position {
    x: number;
    y: number;
}

export interface IStore {
    canvas: HTMLCanvasElement | null;
    state: {
        position: Position;
        content: string | null;
    };
    setCanvas: (el: HTMLCanvasElement | null) => void;
    setCursor: (cursor: string) => void;
    setContent: (text: string | null) => void;
}
