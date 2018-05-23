

export interface State {
    mouseDragMode: boolean;
    stepMode: boolean;
    switchMode: boolean;
}

export interface IStore {
    state: State;
    setMouseDragMode: (mode: boolean) => boolean;
    setStepMode: (mode: boolean) => void;
    setSwitchMode: (mode: boolean) => void;
}
