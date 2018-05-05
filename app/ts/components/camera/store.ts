import { observable } from 'mobx';
import { Vector2 } from 'three';
import { clamped } from '~/utils';
import { IStore } from './types';
import { MAX_SPEED } from '~/constants';
import { CAMERA_PAN_MULT, MIN_CAMERA_SPEED } from './constants';


export const Store: IStore = {
    state: observable({
        zoom: 1,
        position: new Vector2()
    }),
    setSpeed(cameraSpeed: Vector2) {
        if (!this.connected) {
            return;
        }
        this.connected.velocity = new Vector2(
            clamped(cameraSpeed.x, MIN_CAMERA_SPEED) ? 0 : (cameraSpeed.x > 0 ? MAX_SPEED : -MAX_SPEED),
            clamped(cameraSpeed.y, MIN_CAMERA_SPEED) ? 0 : (cameraSpeed.y > 0 ? -MAX_SPEED : MAX_SPEED)
        );
    },
    updateConnected(v: Vector2) {
        if (!this.connected) {
            return;
        }
        this.connected.update(v.clone().multiplyScalar(CAMERA_PAN_MULT));
    }
};
