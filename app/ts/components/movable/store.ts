// import { observable, runInAction } from 'mobx';
import { IStore, IBodyStore } from './types';


export const Store: IStore = {
    bodies: [],// observable([]),
    add(el: IBodyStore) {
        // runInAction(() => {
        this.bodies.push(el);
        // });
    }
};
