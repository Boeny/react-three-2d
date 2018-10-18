import { observable, runInAction } from 'mobx';
import { IStore } from './types';


export const Store: IStore = {
    mouseDragMode: false,
    state: observable({
        stepMode: true,
        switchMode: false
    }),
    setMouseDragMode(mode: boolean) {
        this.mouseDragMode = mode;
    },
    setStepMode(mode: boolean) {
        runInAction(() => {
            this.state.stepMode = mode;
        });
    },
    setSwitchMode(mode: boolean) {
        runInAction(() => {
            this.state.switchMode = mode;
        });
    }
};
