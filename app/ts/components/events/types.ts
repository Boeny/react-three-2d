

export interface State {
    mouseDragMode: boolean;
    stepMode: boolean;
}

export interface IStore {
    state: State;
    setMouseDragMode: (mode: boolean) => void;
    setStepMode: (mode: boolean) => void;
}
