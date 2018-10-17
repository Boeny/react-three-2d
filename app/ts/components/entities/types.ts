import { State as CameraState } from '~/components/camera/types';


export type Zoom = CameraState['zoom'];
export type Position3 = CameraState['position'];

export interface Color {
    r: number;
    g: number;
    b: number;
}

export type Data = Coobject<number>; // coo -> color

export interface State {
    data: Data;
    local: Coobject<Data>;
    mode: number;
    currentCoo: string;
    showNegative: boolean;
    size: { width: number, height: number };
}

export interface IStore {
    state: State;
    init: () => void;
    initLocal: () => void;
    setDataAndSize: (data: Data) => void;
    nextStep: () => void;
    setMode: (mode: number) => void;
    nextMode: () => void;
    toggleNegative: () => void;
    save: () => void;
    getZoomNear: () => Zoom | undefined;
    getZoomFar: () => Zoom | undefined;
    getRotationByZoom: (zoom: Zoom) => Position3;
    getTranslationByRotation: (rotation: Position3) => Position3;
}

export interface SavedData {
    zoom: Zoom;
    position: Position3;
    rotation: Position3;
    translation: Position3;
    state: State;
    stack: string[];
}
