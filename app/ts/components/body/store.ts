import { observable, runInAction } from 'mobx';
import { Vector2 } from 'three';
import { IStore, CommonParams, Signal } from './types';


export interface InitialParams extends CommonParams {
    color: string;
    position: Vector2;
    velocity?: Vector2;
    name?: string | JSX.Element;
}

export function getStore({ name, position, color, velocity, ...common }: InitialParams): IStore {
    return {
        ...common,
        state: observable({
            color,
            name: name || null
        }),
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
        setName(name?: string | JSX.Element) {
            runInAction(() => {
                this.state.name = name || null;
            });
        },
        setPosition(v: Position) {
            runInAction(() => {
                this.position.x = v.x;
                this.position.y = v.y;
                this.onPositionChange && this.onPositionChange(this.position);
            });
        },
        setVelocity(v: number, coo: 'x' | 'y') {
            this.velocity[coo] = v;
            this.onVelocityChange && this.onVelocityChange(this.velocity);
        },
        changePosition(v: Vector2) {
            runInAction(() => {
                this.position.x += v.x;
                this.position.y += v.y;
                this.onPositionChange && this.onPositionChange(this.position);
            });
        },
        signal(s: Signal) {
            this.onSignal && this.onSignal(this, s);
        }
    };
}
