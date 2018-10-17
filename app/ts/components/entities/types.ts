import { State as CameraState } from '~/components/camera/types';
import { Position3 } from '~/types';


export { Position3 };

export type Zoom = CameraState['zoom'];

export interface Color {
    r: number;
    g: number;
    b: number;
}

export type Data = Coobject<number>; // coo -> color

export interface State {
    data: Data;
    local: Coobject<Coobject<string>>;
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
