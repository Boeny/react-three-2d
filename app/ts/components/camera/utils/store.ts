import { Store } from '../store';
import { Vector2 } from 'three';
import { IStore } from '../types';
import { isMoving } from '../utils';
import { SPEED_DECREASE } from '../constants';


const getElementSetter = (store: IStore) => (element: any) => {
    store.DOM = element;
};
export const setCamera = getElementSetter(Store);


const getDecreaseSpeed = (store: IStore) => () => {
    if (store.speed !== null) {
        setSpeed(isMoving(store.speed) ? store.speed.clone().multiplyScalar(SPEED_DECREASE) : null);
    }
};
export const decreaseSpeed = getDecreaseSpeed(Store);


const getSpeedSetter = (store: IStore) => (v: Vector2 | null) => {
    store.speed = v;
};
export const setSpeed = getSpeedSetter(Store);
