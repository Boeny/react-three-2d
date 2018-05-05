import { observable } from 'mobx';
import { Vector2 } from 'three';
import { update } from './actions';
import { IStore } from './types';


export function getStore(position: Vector2, color: string, afterUpdate?: (pos: Vector2) => void): IStore {
    const store: IStore = {
        afterUpdate,
        color,
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
