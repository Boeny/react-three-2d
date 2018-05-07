import { Vector2 } from 'three';
import { addCollider } from './actions';
import { IBodyStore } from './types';
import { Colliders } from './constants';


export function getCollider(x: number, y: number): IBodyStore | undefined {
    return Colliders[`${x}|${y}`];
}

export function setCollider(position: Vector2, store: IBodyStore) {
    addCollider({
        name: store.name || '',
        color: store.color
    });
    return Colliders[`${position.x}|${position.y}`] = store;
}

export function delCollider(position: Vector2) {
    Colliders[`${position.x}|${position.y}`] = undefined;
}
