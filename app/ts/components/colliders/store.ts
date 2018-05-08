import { observable, runInAction } from 'mobx';
import { IStore, ReducedCollider } from './types';


export const Store: IStore = observable({
    colliders: observable([] as ReducedCollider[]),
    add(el: ReducedCollider) {
        runInAction(() => {
            this.colliders.push(el);
        });
    }
});
