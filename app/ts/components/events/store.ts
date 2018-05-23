import { observable, runInAction } from 'mobx';
import { IStore } from './types';
import { MOUSE_DRAG_MODE_ENABLED } from '~/constants';

export const Store: IStore = {
    state: observable({
        mouseDragMode: false,
        stepMode: false,
        switchMode: false
    }),
    setMouseDragMode(mode: boolean) {
        if (MOUSE_DRAG_MODE_ENABLED === false) {
            return false;
        }
        runInAction(() => {
            this.state.mouseDragMode = mode;
        });
        return true;
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
