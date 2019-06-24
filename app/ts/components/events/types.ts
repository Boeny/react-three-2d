

export interface State {
    mouseDragMode: boolean;
    stepMode: boolean;
    switchMode: boolean;
}

export interface IStore extends State {
    setMouseDragMode: (mode: boolean) => void;
    setStepMode: (mode: boolean) => void;
    setSwitchMode: (mode: boolean) => void;
}
