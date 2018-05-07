import { observable, runInAction } from 'mobx';
import { IStore, MouseMode, KeyMode } from './types';


export const Store: IStore = {
    state: observable({
        mouseMode: 'idle' as MouseMode,
        keyMode: { type: 'idle' } as KeyMode
    }),
    setMouseMode(mode: MouseMode) {
        runInAction(() => {
            this.state.mouseMode = mode;
        });
    },
    setKeyMode(mode: KeyMode) {
        runInAction(() => {
            this.state.keyMode = mode;
        });
    }
};
