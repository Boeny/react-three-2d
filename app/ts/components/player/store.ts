import { IStore } from './types';


export const Store: IStore = {
    instance: undefined,
    moveRight() {
        if (this.instance) {
            this.instance.velocity.x = 1;
        }
    },
    moveLeft() {
        if (this.instance) {
            this.instance.velocity.x = -1;
        }
    },
    moveUp() {
        if (this.instance) {
            this.instance.velocity.y = 1;
        }
    },
    moveDown() {
        if (this.instance) {
            this.instance.velocity.y = -1;
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
    }
};
