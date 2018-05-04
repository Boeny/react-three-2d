import { observable, runInAction } from 'mobx';
import { IStore, Mode } from './types';


export const Store: IStore = {
    state: observable({
        mouseMode: 'idle' as Mode
    }),
    setMode(mode: Mode) {
        runInAction(() => {
            this.state.mouseMode = mode;
        });
    }
};
