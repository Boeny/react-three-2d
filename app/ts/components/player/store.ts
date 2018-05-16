import { observable, runInAction } from 'mobx';
import { Vector2 } from 'three';
import { IStore } from './types';
import { MAX_SPEED } from '~/constants';


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
        runInAction(() => {
            this.position.x = v.x;
            this.position.y = v.y;
        });
    },
    moveRight() {
        runInAction(() => {
            this.moving.right = true;
            this.velocity.x = MAX_SPEED;
        });
    },
    moveLeft() {
        runInAction(() => {
            this.moving.left = true;
            this.velocity.x = -MAX_SPEED;
        });
    },
    moveUp() {
        runInAction(() => {
            this.moving.up = true;
            this.velocity.y = MAX_SPEED;
        });
    },
    moveDown() {
        runInAction(() => {
            this.moving.down = true;
            this.velocity.y = -MAX_SPEED;
        });
    },

    stopX() {
        runInAction(() => {
            this.velocity.x = 0;
        });
    },
    stopY() {
        runInAction(() => {
            this.velocity.y = 0;
        });
    },

    stopMovingLeft() {
        runInAction(() => this.moving.left = false);
        if (this.moving.right) {
            this.moveRight();
        } else {
            this.stopX();
        }
    },
    stopMovingRight() {
        runInAction(() => this.moving.right = false);
        if (this.moving.left) {
            this.moveLeft();
        } else {
            this.stopX();
        }
    },
    stopMovingUp() {
        runInAction(() => this.moving.up = false);
        if (this.moving.down) {
            this.moveDown();
        } else {
            this.stopY();
        }
    },
    stopMovingDown() {
        runInAction(() => this.moving.down = false);
        if (this.moving.up) {
            this.moveUp();
        } else {
            this.stopY();
        }
    }
};
