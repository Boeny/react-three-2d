import { action } from 'mobx';
import { Store } from './store';
import { IStore } from './types';


export const getAddColliderAction = (store: IStore) => (el: { name: string, color: string }) => {
    store.colliders.push(el);
};

export const addCollider = action(getAddColliderAction(Store));
