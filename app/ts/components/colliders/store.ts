import { observable, runInAction } from 'mobx';
import { IStore, Data } from './types';


export const Store: IStore = observable({
    colliders: observable([] as Data[]),
    add(el: Data) {
        runInAction(() => {
            this.colliders.push(el);
        });
    }
});
