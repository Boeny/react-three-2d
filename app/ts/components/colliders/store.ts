import { observable, runInAction } from 'mobx';
import { IStore, Collider } from './types';


export const Store: IStore = observable({
    colliders: observable([] as Collider[]),
    add(el: Collider) {
        runInAction(() => {
            this.colliders.push(el);
        });
    },
    del(el: Collider) {
        const i = this.colliders.indexOf(el);
        if (i === -1) {
            return;
        }
        runInAction(() => {
            this.colliders.splice(i, 1);
        });
    }
});
