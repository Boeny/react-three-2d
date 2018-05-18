import { observable, runInAction } from 'mobx';
import { clampByMin, clampByMax } from '~/utils';
import { IStore } from './types';
import { ZOOM_SCREEN_DELTA, CAMERA_FAR, CAMERA_NEAR, CAMERA_INIT_ZOOM } from './constants';


export const Store: IStore = {
    state: observable({
        zoom: CAMERA_INIT_ZOOM,
        position: { x: 0, y: 0 }
    }),
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
    setPosition(v: { x: number, y: number }) {
        runInAction(() => {
            this.state.position.x = v.x;
            this.state.position.y = v.y;
        });
    }
};
