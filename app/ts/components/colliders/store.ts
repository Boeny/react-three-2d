import { observable, runInAction } from 'mobx';
import { IStore, IBodyStore, Position, Colliders } from './types';


export const Store: IStore = {
    state: observable({
        colliders: {} as Colliders
    }),
    add(store: IBodyStore) {
        runInAction(() => {
            this.state.colliders = {
                ...this.state.colliders,
                [`${store.position.x}|${store.position.y}`]: store
            };
        });
    },
    del(position: Position) {
        runInAction(() => {
            this.state.colliders = {
                ...this.state.colliders,
                [`${position.x}|${position.y}`]: undefined
            };
        });
    }
};
