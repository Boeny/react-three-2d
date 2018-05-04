import { observable } from 'mobx';
import { Vector3, Vector2 } from 'three';
import { isMoving } from './utils';
import { IStore } from './types';
import { SPEED_DECREASE } from './constants';


export const Store: IStore = {
    state: observable({
        zoom: 1,
        position: new Vector3(0, 0, 5)
    }),
    DOM: null,
    speed: null,
    setCamera(element: any) {
        this.DOM = element;
    },
    setSpeed(v: Vector2 | null) {
        this.speed = v;
    },
    decreaseSpeed() {
        if (this.speed === null) {
            return;
        }
        this.setSpeed(
            isMoving(this.speed) ?
                this.speed.clone().multiplyScalar(SPEED_DECREASE)
                : null
        );
    }
};
