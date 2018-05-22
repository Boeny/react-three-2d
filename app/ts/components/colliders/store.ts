import { observable, runInAction } from 'mobx';
import { IStore, IBodyStore } from './types';


export const Store: IStore = observable({
    colliders: observable([] as IBodyStore[]),
    add(el: IBodyStore) {
        runInAction(() => {
            this.colliders.push(el);
        });
    },
    del(el: IBodyStore) {
        const i = this.colliders.indexOf(el);
        if (i === -1) {
            return;
        }
        runInAction(() => {
            this.colliders.splice(i, 1);
        });
    }
});
