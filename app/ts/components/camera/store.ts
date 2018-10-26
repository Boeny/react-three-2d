import { Camera, Vector2, Vector3 } from 'three';
import { observable, runInAction } from 'mobx';
import { Store as html } from '~/views/html/store';
import { clampByMin, clampByMax } from '~/utils';
import { IStore, State, AfterZoom, Position3 } from './types';
import { ZOOM_SCREEN_DELTA, CAMERA_FAR, CAMERA_NEAR, CAMERA_INIT_ZOOM } from './constants';


export const Store: IStore = {
    instance: null,
    state: observable({
        zoom: CAMERA_INIT_ZOOM,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        translation: { x: 0, y: 0, z: 0 }
    }),
    setInstance(camera: Camera | null) {
        this.instance = camera;
    },
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
        const width = html.state.windowWidth;
        const { zoom } = this.state;
        const dz = 2 * ZOOM_SCREEN_DELTA * zoom;
        // zoom in
        if (delta < 0) {
            this.setZoom(clampByMin(zoom * width / (width + dz), near || CAMERA_NEAR), after);
            return;
        }
        // zoom out
        if (width > dz) {
            this.setZoom(clampByMax(zoom * width / (width - dz), far || CAMERA_FAR), after);
        }
    },
    setPosition(v: State['position']) {
        runInAction(() => {
            this.state.position = v;
        });
    },
    updatePositionBy(p: Position3) {
        const { position } = this.state;
        this.setPosition({
            x: position.x + p.x,
            y: position.y + p.y,
            z: position.z + p.z
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
    },
    getVector2Position(): Vector2 {
        return new Vector2(this.state.position.x, this.state.position.y);
    },
    getVector3Position(): Vector3 {
        return new Vector3(this.state.position.x, this.state.position.y, this.state.position.z);
    }
};
