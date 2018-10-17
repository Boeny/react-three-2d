

export type AfterZoom = (zoom: State['zoom']) => void;

export interface State {
    zoom: number;
    position: { x: number, y: number, z: number };
    rotation: { x: number, y: number, z: number };
    translation: { x: number, y: number, z: number };
}

export interface IStore {
    state: State;
    init: (state: State) => void;
    setZoom: (zoom: number, after?: AfterZoom) => void;
    updateZoomBy: (newZoom: number, near?: number, far?: number, after?: AfterZoom) => void;
    setPosition: (v: State['position']) => void;
    setRotation: (v: State['position']) => void;
    setTranslation: (v: State['position']) => void;
}
