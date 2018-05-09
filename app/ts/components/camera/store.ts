import { observable, runInAction } from 'mobx';
import { Vector2 } from 'three';
import { clamped, toWorldVector, clampByMin, clampByMax } from '~/utils';
import { IStore } from './types';
import { MAX_SPEED } from '~/constants';
import { MIN_CAMERA_SPEED, ZOOM_SCREEN_DELTA, CAMERA_FAR, CAMERA_NEAR } from './constants';


export const Store: IStore = {
    state: observable({
        zoom: CAMERA_NEAR,
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
        if (this.connected) {
            this.connected.update(toWorldVector(v.clone()));
        }
    },
    setZoom(delta: number) {
        if (delta === 0) {
            return;
        }
        const width = window.innerWidth;
        const { zoom } = this.state;
        const dz = 2 * ZOOM_SCREEN_DELTA * zoom;
        runInAction(() => {
            // zoom in
            if (delta < 0) {
                this.state.zoom = clampByMin(zoom * width / (width + dz), CAMERA_NEAR);
                return;
            }
            // zoom out
            if (width > dz) {
                this.state.zoom = clampByMax(zoom * width / (width - dz), CAMERA_FAR);
            }
        });
    },
    setPosition(v: Vector2) {
        runInAction(() => {
            this.state.position = v;
        });
    }
};
