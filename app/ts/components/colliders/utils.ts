// import { Store } from './store';
import { Collider, Position } from './types';


const Colliders: { [coo: string]: Collider | undefined } = {};

export function getCollider(x: number, y: number): Collider | undefined {
    return Colliders[`${x}|${y}`];
}

export function setCollider(store: Collider) {
    return Colliders[`${store.position.x}|${store.position.y}`] = store;
}

export function delCollider(position: Position) {
    Colliders[`${position.x}|${position.y}`] = undefined;
}
