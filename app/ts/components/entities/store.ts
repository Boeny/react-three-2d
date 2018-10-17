import { observable, runInAction, toJS } from 'mobx';
import { Store as camera } from '../camera/store';
import {
    getNewData, getNewValueAtCoo, getSizeFromData, showDataAndStack, getPositionByCoo, getDefaultData
} from './utils';
import { IStore, Data, Zoom, Position3 } from './types';
import { savedData } from '~/saves';
import { WIDTH_SCALE } from '~/constants';


const ROT_ZOOM_NEAR = 3.2;
const ROT_ZOOM_FAR = 6;
const ROT_MAX_ANGLE = Math.PI / 4;
const ROT_BASE = ROT_MAX_ANGLE / (1 - ROT_ZOOM_NEAR / ROT_ZOOM_FAR);
const ROT_MULT = -ROT_BASE / ROT_ZOOM_FAR;

const MAX_DELTA_COO = WIDTH_SCALE;
const POS_MULT = MAX_DELTA_COO / ROT_MAX_ANGLE;

export const Store: IStore = {
    state: observable(savedData.state),
    init() {
        console.log(savedData);
        this.setDataAndSize(
            Object.keys(this.state.data).length > 0 ?
                this.state.data : getDefaultData()
        );
    },
    setDataAndSize(data: Data) {
        runInAction(() => {
            this.state.data = data;
            this.state.size = getSizeFromData(data);
        });
    },
    nextStep() {
        runInAction(() => {
            if (this.state.mode > 0) {
                const result = getNewValueAtCoo(toJS(this.state.data));
                this.state.currentCoo = result.coo;
                this.setDataAndSize(result.data);
            } else {
                this.setDataAndSize(getNewData(toJS(this.state.data)));
            }
        });
    },
    setMode(mode: number) {
        runInAction(() => this.state.mode = mode);
    },
    nextMode() {
        this.setMode(this.state.mode + 1);
        console.log('mode = ', this.state.mode);
        if (this.state.mode === 1) {
            const zoom = 4;
            const positionByCoo = getPositionByCoo(this.state.currentCoo);
            const rotation = this.getRotationByZoom(zoom);
            camera.init({
                zoom,
                rotation,
                position: {
                    x: positionByCoo.x + 0.5 * WIDTH_SCALE,
                    y: positionByCoo.y + 0.5 * WIDTH_SCALE,
                    z: -3
                },
                translation: this.getTranslationByRotation(rotation)
            });
        }
    },
    toggleNegative() {
        runInAction(() => this.state.showNegative = !this.state.showNegative);
        console.log('show negative mass = ', this.state.showNegative);
    },
    save() {
        console.log('saving...');
        showDataAndStack(this.state);
    },
    getZoomNear(): Zoom | undefined {
        switch (this.state.mode) {
            case 0:
                return 6;
            case 1:
                return 3.2;
        }
    },
    getZoomFar(): Zoom | undefined {
        switch (this.state.mode) {
            case 0:
                return 200;
            case 1:
                return 6;
        }
    },
    getRotationByZoom(zoom: number): Position3 {
        switch (this.state.mode) {
            case 1:
                return {
                    x: zoom * ROT_MULT + ROT_BASE,
                    y: 0,
                    z: 0
                };
            case 0:
            default:
                return {
                    x: 0,
                    y: 0,
                    z: 0
                };
        }
    },
    getTranslationByRotation(rotation: Position3): Position3 {
        switch (this.state.mode) {
            case 1:
                return {
                    x: 0,
                    y: rotation.y * POS_MULT - 0.5,
                    z: 0
                };
            case 0:
            default:
                return {
                    x: 0,
                    y: 0,
                    z: 0
                };
        }
    }
};
