import { observable, runInAction } from 'mobx';
import { IStore, Data } from './types';


export const Store: IStore = observable({
    colliders: observable([] as Data[]),
    add(el: Data) {
        runInAction(() => {
            this.colliders.push(el);
        });
    },
    del(el: Data) {
        const i = this.colliders.indexOf(el);
        runInAction(() => {
            this.colliders.splice(i, 1);
        });
    }
});
