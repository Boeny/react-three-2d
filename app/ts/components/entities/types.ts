import { Vector2, Object3D } from 'three';
import { State as CameraState } from '~/components/camera/types';
import { Position3, Position } from '~/types';


export { Position3 };

export type Zoom = CameraState['zoom'];

export type Data = Coobject<number>; // coo -> color

export interface State extends BaseState {
    local: Coobject<Data>;
    mode: number;
    currentCoo: string;
    showNegative: boolean;
    showStack: boolean;
    selectedObjectPosition: Position | null;
}

export interface BaseState {
    data: Data;
}

export interface IStore {
    state: State;
    nextState: BaseState;
    init: () => void;
    initLocal: () => void;
    setData: (data: Data) => void;
    setNextDataAndSize: (data: Data) => void;
    nextStep: () => void;
    setMode: (mode: number) => void;
    nextMode: () => void;
    toggleNegative: () => void;
    toggleStack: () => void;
    save: () => void;
    getZoomNear: () => Zoom | undefined;
    getZoomFar: () => Zoom | undefined;
    getRotationByZoom: (zoom: Zoom) => Position3;
    getTranslationByRotation: (rotation: Position3) => Position3;
    select: (v: Vector2) => void;
    selectObject: (o: Object3D | null) => void;
}

export interface SavedData {
    camera: CameraState;
    stack: string[];
    state: State;
    nextState: BaseState;
}
