

export type MouseMode = 'idle' | 'drag';
export type KeyMode = 'idle' | 'step';

export interface State {
    mouseMode: MouseMode;
    keyMode: KeyMode;
}

export interface IStore {
    state: State;
    setMouseMode: (mode: MouseMode) => void;
    setKeyMode: (mode: KeyMode) => void;
}
