import { Store } from './store';
import { IBodyStore, Position } from './types';


const Colliders: { [coo: string]: IBodyStore | undefined } = {};

export function getCollider(x: number, y: number): IBodyStore | undefined {
    return Colliders[`${x}|${y}`];
}

export function setCollider(store: IBodyStore) {
    Store.add(store);
    Colliders[`${store.position.x}|${store.position.y}`] = store;
}

export function updateCollider(position: Position) {
    const store = getCollider(position.x, position.y);
    if (store) {
        Colliders[`${store.position.x}|${store.position.y}`] = store;
    }
}

export function delCollider(position: Position) {
    const store = getCollider(position.x, position.y);
    if (store) {
        Store.del(store);
        Colliders[`${store.position.x}|${store.position.y}`] = undefined;
    }

}
