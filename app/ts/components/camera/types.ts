import { Position3 } from '~/types';


export { Position3 };

export type AfterZoom = (zoom: State['zoom']) => void;

export interface State {
    zoom: number;
    position: Position3;
    rotation: Position3;
    translation: Position3;
}

export interface IStore {
    state: State;
    init: (state: State) => void;
    setZoom: (zoom: number, after?: AfterZoom) => void;
    updateZoomBy: (newZoom: number, near?: number, far?: number, after?: AfterZoom) => void;
    setPosition: (v: Position3) => void;
    setRotation: (v: Position3) => void;
    setTranslation: (v: Position3) => void;
    updatePositionBy: (v: Position3) => void;
}
