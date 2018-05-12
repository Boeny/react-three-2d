import { observable, runInAction } from 'mobx';
import { Vector2 } from 'three';
import { IStore, CommonParams } from './types';


export interface InitialParams extends CommonParams {
    position: Vector2;
}

export function getStore({ position, ...common }: InitialParams): IStore {
    return {
        ...common,
        position: observable({
            x: position.x,
            y: position.y
        }),
        velocity: new Vector2(),
        update(v: Vector2) {
            runInAction(() => {
                this.position.x += v.x;
                this.position.y += v.y;
                this.afterUpdate && this.afterUpdate(
                    new Vector2(this.position.x, this.position.y)
                );
            });
        }
    };
}
