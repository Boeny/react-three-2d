import { observable, runInAction } from 'mobx';
import { Vector2 } from 'three';
import { IStore } from './types';


export const Store: IStore = {
    moving: observable({
        left: false,
        right: false,
        up: false,
        down: false
    }),
    position: observable({ x: 0, y: 0 }),
    velocity: observable({ x: 0, y: 0 }),
    init(v: Vector2) {
        this.setPosition(v.x, v.y);
    },
    setPosition(x: number, y: number) {
        runInAction(() => {
            this.position.x = x;
            this.position.y = y;
        });
    },
    setVelocity(v: number, coo: 'x' | 'y') {
        if (this.velocity[coo] === v) {
            return;
        }
        runInAction(() => {
            this.velocity[coo] = v;
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

    stopX() {
        this.setVelocity(0, 'x');
    },
    stopY() {
        this.setVelocity(0, 'y');
    },

    stopMovingLeft() {
        this.moveLeft(false);
        if (this.moving.right) {
            this.moveRight(true);
        } else {
            this.stopX();
        }
    },
    stopMovingRight() {
        this.moveRight(false);
        if (this.moving.left) {
            this.moveLeft(true);
        } else {
            this.stopX();
        }
    },
    stopMovingUp() {
        this.moveUp(false);
        if (this.moving.down) {
            this.moveDown(true);
        } else {
            this.stopY();
        }
    },
    stopMovingDown() {
        this.moveDown(false);
        if (this.moving.up) {
            this.moveUp(true);
        } else {
            this.stopY();
        }
    }
};
