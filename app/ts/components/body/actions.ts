import { action } from 'mobx';
import { Vector2 } from 'three';
import { IStore } from'./types';


export const update = (store: IStore) => action((v: Vector2) => {
    store.position.x += v.x;
    store.position.y += v.y;
});
