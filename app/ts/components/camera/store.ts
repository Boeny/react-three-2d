import { observable, action } from 'mobx';
import { clampByMin, clampByMax } from '~/utils';
import { IStore } from './types';
import { ZOOM_SCREEN_DELTA, CAMERA_FAR, CAMERA_NEAR, CAMERA_INIT_ZOOM } from './constants';


class CameraStore implements IStore {

    @observable
    zoom = CAMERA_INIT_ZOOM;

    @observable
    position = { x: 0, y: 0 };

    @action
    setZoom(delta: number) {
        if (delta === 0) {
            return;
        }
        const width = window.innerWidth;
        const dz = 2 * ZOOM_SCREEN_DELTA * this.zoom;
        // zoom in
        if (delta < 0) {
            this.zoom = clampByMin(this.zoom * width / (width + dz), CAMERA_NEAR);
            return;
        }
        // zoom out
        if (width > dz) {
            this.zoom = clampByMax(this.zoom * width / (width - dz), CAMERA_FAR);
        }
    }

    @action
    setPosition(v: { x: number, y: number }) {
        this.position.x = v.x;
        this.position.y = v.y;
    }
}

export const cameraStore = new CameraStore();
