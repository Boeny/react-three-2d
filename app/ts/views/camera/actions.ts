import { action } from 'mobx';
import { Store } from './store';
import { Vector3, Vector2 } from 'three';
import { IStore, State } from './types';


const getZoomSetterAction = (store: State) => (zoom: number) => {
    if (zoom > 0) {// farther
        store.zoom /= 1.1;
    } else {// nearer
        store.zoom += Math.sqrt(store.zoom) / 10;
    }
};
export const setZoom = action(getZoomSetterAction(Store.state));


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
