// import { action } from 'mobx';
import { IStore, IBodyStore } from './types';


export const push = (store: IStore) => (el: IBodyStore) => {
    store.bodies.push(el);
};
