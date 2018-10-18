

export interface State {
    stepMode: boolean;
    switchMode: boolean;
}

export interface IStore {
    mouseDragMode: boolean;
    state: State;
    setMouseDragMode: (mode: boolean) => void;
    setStepMode: (mode: boolean) => void;
    setSwitchMode: (mode: boolean) => void;
}
