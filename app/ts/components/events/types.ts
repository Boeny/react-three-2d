

export type Mode = 'idle' | 'drag' | 'target';

export interface State {
    mouseMode: Mode;
}

export interface IStore {
    state: State;
    setMode: (mode: Mode) => void;
}
