import { Vector2 } from 'three';
import { addCollider } from './actions';
import { Collider } from './types';
import { Colliders } from './constants';


export function getCollider(x: number, y: number): Collider | undefined {
    return Colliders[`${x}|${y}`];
}

export function setCollider(store: Collider) {
    addCollider({
        name: store.name || '',
        color: store.color
    });
    return Colliders[`${store.position.x}|${store.position.y}`] = store;
}

export function delCollider(position: Vector2) {
    Colliders[`${position.x}|${position.y}`] = undefined;
}
