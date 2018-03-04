import { action } from 'mobx';
import { Store } from './store';
import { Vector3, Vector2 } from 'three';
import { IStore, State } from './types';
import { ZOOM_SHIFT } from './constants';


const getZoomSetterAction = (store: IStore) => (newZoom: number) => {
    const width = window.innerWidth;
    const dz = ZOOM_SHIFT;
    if (newZoom < 0) {
        if (store.state.zoom <= 1) {
            store.state.zoom *= width / (width - 2 * dz * store.state.zoom);
        } else {
            store.state.zoom += Math.sqrt(store.state.zoom / 10);
        }
    } else {
        store.state.zoom *= width / (width + 2 * dz * store.state.zoom);
    }
};
export const setZoom = action(getZoomSetterAction(Store));


const getPositionSetterAction = (store: State) => (v: Vector3) => {
    store.position = v;
};
export const setPosition = action(getPositionSetterAction(Store.state));


const getShiftPosition = (store: State) => (v: Vector2) => {
    setPosition(store.position.clone().add(new Vector3(v.x / store.zoom, - v.y / store.zoom, 0)));
};
export const shiftPosition = getShiftPosition(Store.state);


const getMoveBySpeed = (store: IStore) => () => {
    if (store.speed !== null) {
        shiftPosition(store.speed);
    }
};
export const moveBySpeed = getMoveBySpeed(Store);
