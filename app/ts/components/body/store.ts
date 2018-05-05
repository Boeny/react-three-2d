import { observable } from 'mobx';
import { Vector2 } from 'three';
import { update } from './actions';
import { IStore } from './types';


export function getStore(position: Vector2, afterUpdate?: (pos: Vector2) => void): IStore {
    const store: IStore = {
        afterUpdate,
        position: observable({
            x: position.x,
            y: position.y
        }),
        velocity: new Vector2(),
        update() {}
    };
    store.update = update(store);
    return store;
}
