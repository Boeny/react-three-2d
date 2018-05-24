import { Store } from './store';
import { IBodyStore, Position } from './types';


export function getCollider(x: number, y: number): IBodyStore | undefined {
    return Store.state.colliders[`${x}|${y}`];
}

export function setCollider(store: IBodyStore) {
    Store.add(store);
}

// only after store has update its position
export function updateCollider(oldPosition: Position) {
    const store = getCollider(oldPosition.x, oldPosition.y);
    if (store) {
        Store.del(oldPosition);
        Store.add(store);
    }
}

export function delCollider(position: Position) {
    Store.del(position);
}
