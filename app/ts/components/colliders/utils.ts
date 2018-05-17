// import { Store } from './store';
import { Collider } from './types';


const Colliders: { [coo: string]: Collider | undefined } = {};

export function getCollider(x: number, y: number): Collider | undefined {
    return Colliders[`${x}|${y}`];
}

export function setCollider(store: Collider) {
    // Store.add(store);
    return Colliders[`${store.position.x}|${store.position.y}`] = store;
}

export function delCollider(position: { x: number, y: number }) {
    const store = Colliders[`${position.x}|${position.y}`];
    if (store === undefined) {
        return;
    }
    // Store.del(store);
    Colliders[`${position.x}|${position.y}`] = undefined;
}
