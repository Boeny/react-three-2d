import { action } from 'mobx';
import { Store } from './store';
import { IStore } from './types';


export const getAddColliderAction = (store: IStore) => (el: string) => {
    store.colliders.push({ color: el });
};

export const addCollider = action(getAddColliderAction(Store));
