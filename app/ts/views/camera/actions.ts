import { action } from 'mobx';
import { Store } from './store';
import { Vector3 } from 'three';
import { IStore } from './types';


const getZoomSetterAction = (store: IStore) => (zoom: number) => {
    if (zoom > 0) {// farther
        store.zoom /= 1.1;
    } else {// nearer
        store.zoom += Math.sqrt(store.zoom) / 10;
    }
};
export const setZoom = action(getZoomSetterAction(Store));


const getElementSetterAction = (store: IStore) => (element: any) => {
    store.DOM = element;
};
export const setCamera = action(getElementSetterAction(Store));


const getPositionSetterAction = (store: IStore) => (position: Vector3) => {
    store.position = position;
};
export const setPosition = action(getPositionSetterAction(Store));


const getShiftPositionAction = (store: IStore) => (x: number, y: number) => {
    setPosition(new Vector3(
        store.position.x + x / store.zoom,
        store.position.y + y / store.zoom,
        0
    ));
};
export const shiftPosition = getShiftPositionAction(Store);
