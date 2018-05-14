// import { Store } from './store';
import { Collider } from './types';


const Colliders: { [coo: string]: Collider | undefined } = {};

export function getCollider(x: number, y: number): Collider | undefined {
    return Colliders[`${x}|${y}`];
}

export function setCollider(store: Collider) {
    /*Store.add({
        name: store.name,
        state: store.state
    });*/
    return Colliders[`${store.position.x}|${store.position.y}`] = store;
}

export function delCollider(position: { x: number, y: number }) {
    Colliders[`${position.x}|${position.y}`] = undefined;
}
