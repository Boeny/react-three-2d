import { Vector2 } from 'three';
import { observable, runInAction, toJS } from 'mobx';
import { Store as camera } from '../camera/store';
import {
    getNewData, getNewDataForSingleCoo, getSizeFromData, showDataAndStack, getPositionByCoo,
    getDefaultData, getLocalData, getNextLocalData, getKey, getNextData
} from './utils';
import { IStore, Data, Zoom, Position3 } from './types';
import { savedData } from '~/saves';


const ROT_ZOOM_NEAR = 3.2;
const ROT_ZOOM_FAR = 6;
const ROT_MAX_ANGLE = Math.PI / 4;
const ROT_BASE = ROT_MAX_ANGLE / (1 - ROT_ZOOM_NEAR / ROT_ZOOM_FAR);
const ROT_MULT = -ROT_BASE / ROT_ZOOM_FAR;

const MAX_DELTA_COO = 1;
const POS_MULT = MAX_DELTA_COO / ROT_MAX_ANGLE;

export const Store: IStore = {
    state: observable(savedData.state),
    nextState: savedData.nextState,
    init() {
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
    setNextDataAndSize(data: Data) {
        runInAction(() => {
            this.nextState.data = data;
        });
    },
    initLocal() {
        const { currentCoo, data } = this.state;
        if (this.state.local[currentCoo]) {
            return;
        }
        runInAction(() => {
            this.state.local = { [currentCoo]: getLocalData(data[currentCoo] || 0) };
        });
    },
    nextStep() {
        runInAction(() => {
            switch (this.state.mode) {
                case 0:
                    this.setDataAndSize(getNewData(toJS(this.state.data)));
                    break;
                case 1:
                    const result = getNewDataForSingleCoo(toJS(this.state.data));
                    this.state.currentCoo = result.coo;
                    this.setDataAndSize(result.data);
                    break;
                case 2:
                    const { local, currentCoo } = this.state;
                    this.state.local = { [currentCoo]: getNextLocalData(local[currentCoo] || {}) };
                    break;
                default:
                    console.warn(`there is no action for mode ${this.state.mode}`);
            }
        });
    },
    setMode(mode: number) {
        runInAction(() => this.state.mode = mode);
    },
    nextMode() {
        const { mode, currentCoo } = this.state;
        runInAction(() => {
            this.setMode(mode + 1);
            if (this.state.mode === 1) {
                this.setNextDataAndSize(getNextData(toJS(this.state.data)));
            } else
            if (this.state.mode === 2) {
                this.initLocal();
            }
        });
        if (this.state.mode === 2) {
            const zoom = 4;
            const positionByCoo = getPositionByCoo(currentCoo);
            const rotation = this.getRotationByZoom(zoom);
            camera.init({
                zoom,
                rotation,
                position: {
                    x: positionByCoo.x + 0.5,
                    y: positionByCoo.y + 0.5,
                    z: -3
                },
                translation: this.getTranslationByRotation(rotation)
            });
        }
        console.log(this.state.mode);
    },
    toggleNegative() {
        runInAction(() => this.state.showNegative = !this.state.showNegative);
        console.log('show negative mass = ', this.state.showNegative);
    },
    toggleStack() {
        runInAction(() => this.state.showStack = !this.state.showStack);
        console.log('show stack = ', this.state.showStack);
    },
    save() {
        console.log('saving...');
        showDataAndStack(this.state, this.nextState);
    },
    getZoomNear(): Zoom | undefined {
        switch (this.state.mode) {
            case 0:
            case 1:
                return 6;
            case 2:
                return 3.2;
        }
    },
    getZoomFar(): Zoom | undefined {
        switch (this.state.mode) {
            case 0:
            case 1:
                return 200;
            case 2:
                return 6;
        }
    },
    getRotationByZoom(zoom: number): Position3 {
        switch (this.state.mode) {
            case 2:
                return {
                    x: zoom * ROT_MULT + ROT_BASE,
                    y: 0,
                    z: 0
                };
            case 0:
            case 1:
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
            case 2:
                return {
                    x: 0,
                    y: rotation.y * POS_MULT - 0.5,
                    z: 0
                };
            case 0:
            case 1:
            default:
                return {
                    x: 0,
                    y: 0,
                    z: 0
                };
        }
    },
    select(v: Vector2) {
        runInAction(() => {
            this.state.currentCoo = getKey({
                x: Math.floor(v.x),
                y: Math.floor(v.y)
            });
            if (this.state.showStack) {
                this.toggleStack();
            }
        });
    }
};
