import { observable, runInAction } from 'mobx';
import { IStore } from './types';
import { MAX_SPEED } from '~/constants';


export const Store: IStore = {
    moving: observable({
        left: false,
        right: false,
        up: false,
        down: false
    }),
    instance: undefined,
    moveRight() {
        if (this.instance) {
            runInAction(() => this.moving.right = true);
            this.instance.velocity.x = MAX_SPEED;
        }
    },
    moveLeft() {
        if (this.instance) {
            runInAction(() => this.moving.left = true);
            this.instance.velocity.x = -MAX_SPEED;
        }
    },
    moveUp() {
        if (this.instance) {
            runInAction(() => this.moving.up = true);
            this.instance.velocity.y = MAX_SPEED;
        }
    },
    moveDown() {
        if (this.instance) {
            runInAction(() => this.moving.down = true);
            this.instance.velocity.y = -MAX_SPEED;
        }
    },

    stopX() {
        if (this.instance) {
            this.instance.velocity.x = 0;
        }
    },
    stopY() {
        if (this.instance) {
            this.instance.velocity.y = 0;
        }
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
