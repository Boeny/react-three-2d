import { Vector2 } from 'three';
import { IStore } from './types';
import { Static } from './constants';


export function getStatic(x: number, y: number): IStore | undefined {
    return Static[`${x}|${y}`];
}

export function setStatic(position: Vector2, store: IStore) {
    return Static[`${position.x}|${position.y}`] = store;
}

export function delStatic(position: Vector2) {
    Static[`${position.x}|${position.y}`] = undefined;
}
