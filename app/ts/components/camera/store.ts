import { observable } from 'mobx';
import { Vector2 } from 'three';
import { clamped, clampedVector } from '~/utils';
import { IStore } from './types';
import { MAX_SPEED, MIN_SPEED } from '~/constants';
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
        this.connected.velocity = new Vector2(
            clamped(v.x, MIN_SPEED) ? 0 : (v.x > 0 ? MAX_SPEED : -MAX_SPEED),
            clamped(v.y, MIN_SPEED) ? 0 : (v.y > 0 ? -MAX_SPEED : MAX_SPEED)
        );
    },
    updateConnected(v: Vector2) {
        if (!this.connected) {
            return;
        }
        const velocity = v.clone().multiplyScalar(CAMERA_PAN_MULT);
        /*const position = new Vector2(this.connected.position.x, this.connected.position.y);
        console.log(position.sub(this.state.position).length());
        if (clampedVector(position.sub(this.state.position), 5)) {
            return;
        }*/
        this.connected.update(velocity);
    }
};
