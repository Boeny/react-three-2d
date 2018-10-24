import { Vector2, Object3D } from 'three';
import { observable, runInAction, toJS } from 'mobx';
import { Store as camera } from '../camera/store';
import {
    getNewData, getNewDataForSingleCoo, showDataAndStack, getPositionByCoo,
    getDefaultData, getLocalData, getKey, getNextData, getCoosAroundPosition, getNextLocalData
} from './utils';
import { IStore, Data, Zoom, Position3 } from './types';
import { savedData } from '~/saves';
import { LOCAL_WIDTH } from './constants';


const GLOBAL_ZOOM_FAR = 200;
const GLOBAL_ZOOM_NEAR = 20;
const LOCAL_ZOOM_NEAR = 3.2;
const LOCAL_ZOOM_FAR = 40;

const ROT_ZOOM_NEAR = LOCAL_ZOOM_NEAR;
const ROT_ZOOM_FAR = 10;
const ROT_MAX_ANGLE = Math.PI / 4;
const ROT_BASE = ROT_MAX_ANGLE / (1 - ROT_ZOOM_NEAR / ROT_ZOOM_FAR);
const ROT_MULT = -ROT_BASE / ROT_ZOOM_FAR;

const MAX_DELTA_COO = 1;
const POS_MULT = MAX_DELTA_COO / ROT_MAX_ANGLE;

const MAX_LOCAL_SIZE = 10;

export const Store: IStore = {
    state: observable(savedData.state),
    nextState: savedData.nextState,
    init() {
        this.setData(
            Object.keys(this.state.data).length > 0 ?
                this.state.data : getDefaultData()
        );
    },
    setData(data: Data) {
        runInAction(() => {
            this.state.data = data;
        });
    },
    setNextDataAndSize(data: Data) {
        runInAction(() => {
            this.nextState.data = data;
        });
    },
    initLocal() {
        const { currentCoo, data, local } = this.state;
        const nextData = this.nextState.data;
        runInAction(() => {
            setNewLocalDataAroundCoo(0, data, nextData, local, currentCoo);
        });
    },
    nextStep() {
        runInAction(() => {
            switch (this.state.mode) {
                case 0:
                    this.setData(getNewData(toJS(this.state.data)));
                    break;
                case 1:
                    const result = getNewDataForSingleCoo(toJS(this.state.data));
                    this.state.currentCoo = result.coo;
                    this.setData(result.data);
                    break;
                case 2:
                    const { local } = this.state;
                    const localData: Coobject<Data> = {};
                    Object.keys(local).map(coo => {
                        localData[coo] = getNextLocalData(local[coo] || {});
                    });
                    this.state.local = localData;
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
        console.log('show negative mass =', this.state.showNegative);
    },
    toggleStack() {
        runInAction(() => this.state.showStack = !this.state.showStack);
        console.log('show stack =', this.state.showStack);
    },
    save() {
        console.log('saving...');
        showDataAndStack(this.state, this.nextState);
    },
    getZoomNear(): Zoom | undefined {
        switch (this.state.mode) {
            case 0:
            case 1:
                return GLOBAL_ZOOM_NEAR;
            case 2:
                return LOCAL_ZOOM_NEAR;
        }
    },
    getZoomFar(): Zoom | undefined {
        switch (this.state.mode) {
            case 0:
            case 1:
                return GLOBAL_ZOOM_FAR;
            case 2:
                return LOCAL_ZOOM_FAR;
        }
    },
    getRotationByZoom(zoom: number): Position3 {
        switch (this.state.mode) {
            case 2:
                return {
                    x: zoom < ROT_ZOOM_FAR ? zoom * ROT_MULT + ROT_BASE : 0,
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
    },
    selectObject(o: Object3D | null) {
        runInAction(() => {
            if (o === null) {
                this.state.selectedObjectPosition = null;
                return;
            }
            const parentPosition = getPositionByCoo(this.state.currentCoo);
            this.state.selectedObjectPosition = {
                x: (o.position.x - parentPosition.x) / LOCAL_WIDTH - 0.5,
                y: (o.position.y - parentPosition.y) / LOCAL_WIDTH - 0.5
            };
        });
    }
};


function setNewLocalDataAroundCoo(
    counter: number, data: Data, nextData: Data, localData: Coobject<Data>,
    currentCoo: string
) {
    if (counter < 2) {
        console.log(currentCoo, data[currentCoo], 'need to increase by', (nextData[currentCoo] || 0) - (data[currentCoo] || 0));
    }
    if (counter === MAX_LOCAL_SIZE) {
        return;
    }
    if (!localData[currentCoo]) {
        localData[currentCoo] = getLocalData(data[currentCoo] || 0);
    }
    getCoosAroundPosition(getPositionByCoo(currentCoo)).map(coo => {
        setNewLocalDataAroundCoo(counter + 1, data, nextData, localData, coo);
    });
}
