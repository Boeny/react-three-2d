import { observable, runInAction } from 'mobx';
import { Vector2 } from 'three';
import { IStore } from './types';


export function getStore(position: Vector2, color: string, afterUpdate?: (pos: Vector2) => void): IStore {
    return {
        afterUpdate,
        color,
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
