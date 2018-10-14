// import { observable, runInAction } from 'mobx';
import { IStore, IBodyStore } from './types';


export const Store: IStore = {
    bodies: [],
    add(el: IBodyStore) {
        this.bodies.push(el);
    },
    del(el: IBodyStore) {
        const i = this.bodies.indexOf(el);
        this.bodies.splice(i, 1);
    }
};
