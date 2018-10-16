

export type Data = Coobject<number>; // coo -> color

export interface State {
    data: Data;
    mode: number;
    currentCoo: string | null;
    showNegative: boolean;
    size: { width: number, height: number };
}

export interface IStore {
    state: State;
    init: () => void;
    setDataAndSize: (data: Data) => void;
    nextStep: () => void;
    setMode: (mode: number) => void;
    nextMode: () => void;
    toggleNegative: () => void;
    save: () => void;
}

export interface SavedData {
    zoom: number;
    position: Position;
    state: State;
    stack: string[];
}
