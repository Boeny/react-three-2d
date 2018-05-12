// import { observable, runInAction } from 'mobx';
import { IStore, IBodyStore } from './types';


export const Store: IStore = {
    bodies: [],// observable([]),
    add(el: IBodyStore) {
        // runInAction(() => {
        this.bodies.push(el);
        // });
    },
    del(el: IBodyStore) {
        const i = this.bodies.indexOf(el);
        // runInAction(() => {
        this.bodies.splice(i, 1);
        // });
    }
};
