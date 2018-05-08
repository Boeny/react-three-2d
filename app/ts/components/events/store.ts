import { observable, runInAction } from 'mobx';
import { IStore } from './types';


export const Store: IStore = {
    state: observable({
        mouseDragMode: false,
        stepMode: false
    }),
    setMouseDragMode(mode: boolean) {
        runInAction(() => {
            this.state.mouseDragMode = mode;
        });
    },
    setStepMode(mode: boolean) {
        runInAction(() => {
            this.state.stepMode = mode;
        });
    }
};
