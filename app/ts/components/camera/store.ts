import { observable, runInAction } from 'mobx';
import { Vector2 } from 'three';
import { clamped, toWorldVector } from '~/utils';
import { IStore } from './types';
import { MAX_SPEED } from '~/constants';
import { MIN_CAMERA_SPEED, ZOOM_MULT } from './constants';


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
        if (this.connected) {
            this.connected.update(toWorldVector(v.clone()));
        }
    },
    setZoom(newZoom: number) {
        const width = window.innerWidth;
        const dz = ZOOM_MULT;
        const { zoom } = this.state;
        runInAction(() => {
            if (newZoom >= 0) {
                this.state.zoom *= width / (width + 2 * dz * zoom);
                return;
            }
            if (zoom <= 1) {
                this.state.zoom *= width / (width - 2 * dz * zoom);
            }
        });
    },
    setPosition(v: Vector2) {
        runInAction(() => {
            this.state.position = v;
        });
    }
};
