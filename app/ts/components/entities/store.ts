import { observable, runInAction, toJS } from 'mobx';
import { IStore, Data } from './types';
import {
    getNewData, getNewValueAtCoo, getSizeFromData, showDataAndStack, getPosition
} from './utils';
import { Store as camera } from '../camera/store';
import { savedData } from '~/saves';


export const Store: IStore = {
    state: observable(savedData.state),
    init() {
        this.setDataAndSize(this.state.data);
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
        console.log('mode = ', this.state.mode + 1);
        if (this.state.mode === 0) {
            const position = getPosition(this.state.currentCoo);
            camera.init({
                zoom: 3,
                position: {
                    x: position.x + 0.5,
                    y: position.y + 0.5
                }
            });
        }
        this.setMode(this.state.mode + 1);
    },
    toggleNegative() {
        console.log('show negative mass = ', !this.state.showNegative);
        runInAction(() => this.state.showNegative = !this.state.showNegative);
    },
    save() {
        console.log('saving...');
        showDataAndStack(this.state);
    },
    getCurrentValue(): number {
        return this.state.data[this.state.currentCoo] || 0;
    }
};
