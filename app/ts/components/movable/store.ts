import { IStore, MovableStore } from './types';


export const Store: IStore = {
    data: [],
    add(el: MovableStore) {
        this.data.push(el);
    },
    del(el: MovableStore) {
        const i = this.data.indexOf(el);
        this.data.splice(i, 1);
    }
};
