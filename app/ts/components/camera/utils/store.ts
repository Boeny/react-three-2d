import { Store } from '../store';
import { Vector2, Vector3 } from 'three';
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


const getToWorldPoint = (store: IStore) => (v: Vector2): { x: number, y: number } => {
    if (store.DOM === null) {
        return { x: 0, y: 0 };
    }
    const v2 = store.DOM.localToWorld(new Vector3(v.x, v.y, 0));
    console.log(store.DOM.projectionMatrix);
    return {
        x: v2.x,
        y: v2.y
    };
};

export const toWorldPoint = getToWorldPoint(Store);
