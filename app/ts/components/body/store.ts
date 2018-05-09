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
        history: observable([]),
        velocity: new Vector2(),
        update(v: Vector2) {
            runInAction(() => {
                this.position.x += v.x;
                this.position.y += v.y;
                this.afterUpdate && this.afterUpdate(
                    new Vector2(this.position.x, this.position.y)
                );
            });
        },
        updateHistory() {
            if (!this.tail) {
                return;
            }
            if (this.velocity.x === 0 && this.velocity.y === 0) {
                if (this.history.length > 0) {
                    runInAction(() => {
                        this.history.pop();// ||-||-x -> ||-||
                    });
                }
                return;
            }
            runInAction(() => {
                if (this.history.length === 0) {
                    this.history.unshift({ x: this.position.x, y: this.position.y });
                    return;
                }
                // ||-||-||-||-|| -> (new)-||-||-||-||-||
                this.history[0].x = this.position.x;
                this.history[0].y = this.position.y;
            });
        }
    };
}
