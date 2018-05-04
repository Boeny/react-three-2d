import { action } from 'mobx';
import { Store } from './store';
import { Vector2 } from 'three';
import { IStore } from './types';
import { ZOOM_SHIFT } from './constants';


const getZoomSetterAction = (store: IStore) => (newZoom: number) => {
    const width = window.innerWidth;
    const dz = ZOOM_SHIFT;
    if (newZoom < 0) {
        if (store.state.zoom <= 1) {
            store.state.zoom *= width / (width - 2 * dz * store.state.zoom);
        }
    } else {
        store.state.zoom *= width / (width + 2 * dz * store.state.zoom);
    }
};

export const setZoom = action(getZoomSetterAction(Store));


const getPositionSetterAction = (store: IStore) => (v: Vector2) => {
    store.state.position = v;
};

export const setPosition = action(getPositionSetterAction(Store));
