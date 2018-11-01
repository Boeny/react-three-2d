import { Vector2 } from 'three';
import { observable, runInAction } from 'mobx';
import { Store as movable } from '../movable/store';
import { getDifficultyLevel } from '~/utils';
import { IStore, Position, State } from './types';


export const Store: IStore = getPlayerStore({
    position: { x: 0, y: 0 },
    rotation: Math.PI / 2
});

export function getPlayerStore(state: State, scenario?: (level: number) => void): IStore {
    if (scenario) {
        movable.add({
            onEveryTick: () => scenario(getDifficultyLevel())
        });
    }
    return {
        moving: observable({
            up: false,
            down: false
        }),
        rotating: observable({
            left: false,
            right: false
        }),
        state: observable(state),
        velocity: new Vector2(),
        rotSpeed: 0,
        _isShooting: false,
        canShoot: true,
        setPosition(p: Position, after?: (p: Position) => void) {
            runInAction(() => {
                this.state.position = p;
                after && after(p);
            });
        },
        setRotation(v: number) {
            runInAction(() => {
                this.state.rotation = v;
            });
        },
        rotateRight(v: boolean) {
            if (this.rotating.right === v) {
                return;
            }
            runInAction(() => {
                this.rotating.right = v;
            });
        },
        rotateLeft(v: boolean) {
            if (this.rotating.left === v) {
                return;
            }
            runInAction(() => {
                this.rotating.left = v;
            });
        },
        moveForward(v: boolean) {
            if (this.moving.up === v) {
                return;
            }
            runInAction(() => {
                this.moving.up = v;
            });
        },
        moveBack(v: boolean) {
            if (this.moving.down === v) {
                return;
            }
            runInAction(() => {
                this.moving.down = v;
            });
        },
        shoot(v: boolean) {
            this._isShooting = v;
        },
        isMoving(): boolean {
            return this.moving.up || this.moving.down;
        },
        isRotating(): boolean {
            return this.rotating.right || this.rotating.left;
        },
        isShooting(): boolean {
            return this._isShooting;
        }
    };
}
