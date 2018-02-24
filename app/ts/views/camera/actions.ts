import { action } from 'mobx';
import { Store } from './store';
import { Vector3, Vector2 } from 'three';
import { IStore, State } from './types';
import { ZOOM_SHIFT } from './constants';


const getZoomSetterAction = (store: IStore) => (newZoom: number) => {
    const width = window.innerWidth;
    if (newZoom < 0 && width - 2 * ZOOM_SHIFT * store.state.zoom < 1) {
        return;
    }
    store.state.zoom *= width / (width + 2 * ZOOM_SHIFT * store.state.zoom * (newZoom > 0 ? 1 : -1));
    console.log(store.state.zoom);
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
