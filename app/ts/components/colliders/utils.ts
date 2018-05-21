import { Store } from './store';
import { Collider, Position } from './types';


const Colliders: { [coo: string]: Collider | undefined } = {};

export function getCollider(x: number, y: number): Collider | undefined {
    return Colliders[`${x}|${y}`];
}

export function setCollider(store: Collider) {
    Store.add(store);
    Colliders[`${store.position.x}|${store.position.y}`] = store;
}

export function delCollider(position: Position) {
    const key = `${position.x}|${position.y}`;
    const store = Colliders[key];
    if (store === undefined) {
        return;
    }
    Store.del(store);
    Colliders[key] = undefined;
}
