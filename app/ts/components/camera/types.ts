

export interface Position {
    x: number;
    y: number;
}

export interface State {
    zoom: number;
    position: Position;
}

export interface IStore {
    state: State;
    setZoom: (newZoom: number) => void;
    setPosition: (v: Position) => void;
}
