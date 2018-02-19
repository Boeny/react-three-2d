import { action } from 'mobx';
import { Store } from './store';
import { Vector3, Vector2 } from 'three';
import { IStore } from './types';
import { isMoving } from '~/views/camera/utils';


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


const getShiftPositionAction = (store: IStore) => (v: Vector2) => {
    setPosition(store.position.add(new Vector3(v.x / store.zoom, -v.y / store.zoom, 0)));
};
export const shiftPosition = getShiftPositionAction(Store);


const getDecreseSpeedAction = (store: IStore) => () => {
    if (isMoving(store.speed)) {
        setSpeed(store.speed.multiplyScalar(0.5));
    }
};
export const decSpeed = getDecreseSpeedAction(Store);


const getSpeedSetterAction = (store: IStore) => (speed: Vector2) => {
    store.speed.x = speed.x;
    store.speed.y = speed.y;
};
export const setSpeed = action(getSpeedSetterAction(Store));


const getMoveBySpeedAction = (store: IStore) => () => {
    if (isMoving(store.speed)) {
        shiftPosition(store.speed);
    }
};
export const moveBySpeed = action(getMoveBySpeedAction(Store));
