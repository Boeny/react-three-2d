import { observable, runInAction } from 'mobx';
import { Vector2 } from 'three';
import { IStore, Position } from './types';


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
    setPosition(v: Position) {
        runInAction(() => {
            this.position.x = v.x;
            this.position.y = v.y;
        });
    },
    setVelocity(v: number, coo: 'x' | 'y') {
        runInAction(() => {
            this.velocity[coo] = v;
        });
    },

    moveRight() {
        runInAction(() => {
            this.moving.right = true;
        });
    },
    moveLeft() {
        runInAction(() => {
            this.moving.left = true;
        });
    },
    moveUp() {
        runInAction(() => {
            this.moving.up = true;
        });
    },
    moveDown() {
        runInAction(() => {
            this.moving.down = true;
        });
    },

    stopX() {
        this.setVelocity(0, 'x');
    },
    stopY() {
        this.setVelocity(0, 'y');
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
