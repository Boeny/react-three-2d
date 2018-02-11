import { action } from 'mobx';
import { Store } from './store';
import { Vector3 } from 'three';
import { IStore } from './types';


const getZoomSetterAction = (store: IStore) => (zoom: number) => {
    if (zoom > 0) {// farther
        store.zoom /= 1.5;
    } else {// nearer
        store.zoom += Math.sqrt(store.zoom) / 100;
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
    setPosition(store.position.add(new Vector3(x, y, 0)));
};
export const shiftPosition = getShiftPositionAction(Store);
