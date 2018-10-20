import { observable, runInAction } from 'mobx';
import { IStore } from './types';


export const Store: IStore = {
    moving: observable({
        left: false,
        right: false,
        up: false,
        down: false
    }),
    position: observable({ x: 0, y: 0 }),
    setPosition(x: number, y: number) {
        runInAction(() => {
            this.position.x = x;
            this.position.y = y;
        });
    },
    moveRight(v: boolean) {
        if (this.moving.right === v) {
            return;
        }
        runInAction(() => {
            this.moving.right = v;
        });
    },
    moveLeft(v: boolean) {
        if (this.moving.left === v) {
            return;
        }
        runInAction(() => {
            this.moving.left = v;
        });
    },
    moveUp(v: boolean) {
        if (this.moving.up === v) {
            return;
        }
        runInAction(() => {
            this.moving.up = v;
        });
    },
    moveDown(v: boolean) {
        if (this.moving.down === v) {
            return;
        }
        runInAction(() => {
            this.moving.down = v;
        });
    },
    isMoving(): boolean {
        return this.moving.right || this.moving.left || this.moving.up || this.moving.down;
    }
};
