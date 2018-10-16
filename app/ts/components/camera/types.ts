

export interface State {
    zoom: number;
    position: Position;
}

export interface IStore {
    state: State;
    init: (state: State) => void;
    setZoom: (zoom: number) => void;
    updateZoomBy: (newZoom: number) => void;
    setPosition: (v: Position) => void;
}
