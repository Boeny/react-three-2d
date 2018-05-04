import { observable } from 'mobx';
import { Vector2 } from 'three';
import { update } from './actions';
import { IStore } from './types';


export function getStore(afterUpdate?: (pos: Vector2) => void): IStore {
    const store: IStore = {
        afterUpdate,
        position: observable({
            x: 0,
            y: 0
        }),
        velocity: new Vector2(),
        update() {}
    };
    store.update = update(store);
    return store;
}
