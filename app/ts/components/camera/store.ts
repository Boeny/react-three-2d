import { observable } from 'mobx';
import { Vector2 } from 'three';
import { IStore } from './types';
import { MAX_SPEED } from '~/constants';
import { CAMERA_PAN_MULT } from './constants';


export const Store: IStore = {
    state: observable({
        zoom: 1,
        position: new Vector2()
    }),
    setSpeed(v: Vector2) {
        if (!this.connected) {
            return;
        }
        this.connected.update(
            new Vector2(
                v.x === 0 ? 0 : (v.x > 0 ? MAX_SPEED : -MAX_SPEED),
                v.y === 0 ? 0 : (v.y > 0 ? -MAX_SPEED : MAX_SPEED)
            )
        );
    },
    updateConnected(v: Vector2) {
        if (this.connected) {
            this.connected.update(v.clone().multiplyScalar(CAMERA_PAN_MULT));
        }
    }
};
