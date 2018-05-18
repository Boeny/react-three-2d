import { observable, runInAction } from 'mobx';
import { Vector2 } from 'three';
import { IStore, CommonParams, Position } from './types';


export interface InitialParams extends CommonParams {
    color: string;
    position: Vector2;
    velocity?: Vector2;
}

export function getStore({ position, color, velocity, ...common }: InitialParams): IStore {
    return {
        ...common,
        state: observable({ color }),
        position: observable({
            x: position.x,
            y: position.y
        }),
        velocity: velocity || new Vector2(),
        setColor(color: string) {
            runInAction(() => {
                this.state.color = color;
            });
        },
        setPosition(v: Position) {
            runInAction(() => {
                this.position.x = v.x;
                this.position.y = v.y;
            });
        },
        update(v: Vector2) {
            runInAction(() => {
                this.position.x += v.x;
                this.position.y += v.y;
                this.onPositionChange && this.onPositionChange(this.position);
            });
        }
    };
}
