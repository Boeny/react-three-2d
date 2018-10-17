import { observable, runInAction } from 'mobx';
import { clampByMin, clampByMax } from '~/utils';
import { IStore, State, AfterZoom } from './types';
import { ZOOM_SCREEN_DELTA, CAMERA_FAR, CAMERA_NEAR, CAMERA_INIT_ZOOM } from './constants';


export const Store: IStore = {
    state: observable({
        zoom: CAMERA_INIT_ZOOM,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        translation: { x: 0, y: 0, z: 0 }
    }),
    init({ position, zoom, rotation, translation }: State) {
        runInAction(() => {
            this.setPosition(position);
            this.setZoom(zoom);
            this.setRotation(rotation);
            this.setTranslation(translation);
        });
    },
    setZoom(zoom: number, after?: AfterZoom) {
        // console.log(zoom);
        runInAction(() => {
            this.state.zoom = zoom;
            after && after(zoom);
        });
    },
    updateZoomBy(delta: number, near?: number, far?: number, after?: AfterZoom) {
        if (delta === 0) {
            return;
        }
        const width = window.innerWidth;
        const { zoom } = this.state;
        const dz = 2 * ZOOM_SCREEN_DELTA * zoom;
        // zoom in
        if (delta < 0) {
            // console.log(zoom * width / (width + dz));
            this.setZoom(clampByMin(zoom * width / (width + dz), near || CAMERA_NEAR), after);
            return;
        }
        // zoom out
        if (width > dz) {
            // console.log(zoom * width / (width - dz));
            this.setZoom(clampByMax(zoom * width / (width - dz), far || CAMERA_FAR), after);
        }
    },
    setPosition(v: State['position']) {
        runInAction(() => {
            this.state.position.x = v.x;
            this.state.position.y = v.y;
            this.state.position.z = v.z;
        });
    },
    setRotation(v: State['position']) {
        runInAction(() => {
            this.state.rotation = v;
        });
    },
    setTranslation(v: State['position']) {
        runInAction(() => {
            this.state.translation = v;
        });
    }
};
