import { observable, runInAction } from 'mobx';
import { clampByMin, clampByMax } from '~/utils';
import { IStore, State } from './types';
import { ZOOM_SCREEN_DELTA, CAMERA_FAR, CAMERA_NEAR, CAMERA_INIT_ZOOM } from './constants';


export const Store: IStore = {
    state: observable({
        zoom: CAMERA_INIT_ZOOM,
        position: { x: 0, y: 0 }
    }),
    init({ position, zoom }: State) {
        runInAction(() => {
            this.setPosition(position);
            this.setZoom(zoom);
        });
    },
    setZoom(zoom: number) {
        runInAction(() => this.state.zoom = zoom);
    },
    updateZoomBy(delta: number) {
        if (delta === 0) {
            return;
        }
        const width = window.innerWidth;
        const { zoom } = this.state;
        const dz = 2 * ZOOM_SCREEN_DELTA * zoom;
        // zoom in
        if (delta < 0) {
            this.setZoom(clampByMin(zoom * width / (width + dz), CAMERA_NEAR));
            return;
        }
        // zoom out
        if (width > dz) {
            this.setZoom(clampByMax(zoom * width / (width - dz), CAMERA_FAR));
        }
    },
    setPosition(v: { x: number, y: number }) {
        runInAction(() => {
            this.state.position.x = v.x;
            this.state.position.y = v.y;
        });
    }
};
