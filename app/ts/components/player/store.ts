import { IStore } from './types';
import { MAX_SPEED } from '~/constants';


export const Store: IStore = {
    isMovingLeft: false,
    isMovingRight: false,
    isMovingUp: false,
    isMovingDown: false,
    instance: undefined,
    moveRight() {
        if (this.instance) {
            this.isMovingRight = true;
            this.instance.velocity.x = MAX_SPEED;
        }
    },
    moveLeft() {
        if (this.instance) {
            this.isMovingLeft = true;
            this.instance.velocity.x = -MAX_SPEED;
        }
    },
    moveUp() {
        if (this.instance) {
            this.isMovingUp = true;
            this.instance.velocity.y = MAX_SPEED;
        }
    },
    moveDown() {
        if (this.instance) {
            this.isMovingDown = true;
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
        this.isMovingLeft = false;
        if (this.isMovingRight) {
            this.moveRight();
        } else {
            this.stopX();
        }
    },
    stopMovingRight() {
        this.isMovingRight = false;
        if (this.isMovingLeft) {
            this.moveLeft();
        } else {
            this.stopX();
        }
    },
    stopMovingUp() {
        this.isMovingUp = false;
        if (this.isMovingDown) {
            this.moveDown();
        } else {
            this.stopY();
        }
    },
    stopMovingDown() {
        this.isMovingDown = false;
        if (this.isMovingUp) {
            this.moveUp();
        } else {
            this.stopY();
        }
    }
};
