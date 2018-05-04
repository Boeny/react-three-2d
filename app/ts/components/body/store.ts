import { observable } from 'mobx';
import { Vector2 } from 'three';
import { update } from './actions';
import { IStore } from './types';


export function getStore(p?: Vector2): IStore {
    const store: IStore = {
        position: observable({
            x: p ? p.x : 0,
            y: p ? p.y : 0
        }),
        velocity: new Vector2(),
        update() {}
    };
    store.update = update(store);
    return store;
}
