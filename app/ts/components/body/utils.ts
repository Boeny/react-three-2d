import { Vector2 } from 'three';
import { IStore } from './types';
import { Colliders } from './constants';


export function getCollider(x: number, y: number): IStore | undefined {
    return Colliders[`${x}|${y}`];
}

export function setCollider(position: Vector2, store: IStore) {
    return Colliders[`${position.x}|${position.y}`] = store;
}

export function delCollider(position: Vector2) {
    Colliders[`${position.x}|${position.y}`] = undefined;
}
