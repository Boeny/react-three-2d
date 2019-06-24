import { observable, action } from 'mobx';
import { IStore } from './types';


class PlayerStore implements IStore {

    @observable
    moving = {
        left: false,
        right: false,
        up: false,
        down: false
    };

    @observable
    position = { x: 0, y: 0 };

    @action
    setPosition(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;
    }

    @action
    moveRight(v: boolean) {
        this.moving.right = v;
    }

    @action
    moveLeft(v: boolean) {
        this.moving.left = v;
    }

    @action
    moveUp(v: boolean) {
        this.moving.up = v;
    }

    @action
    moveDown(v: boolean) {
        this.moving.down = v;
    }

    get isMoving(): boolean {
        return this.moving.right || this.moving.left || this.moving.up || this.moving.down;
    }
}

export const playerStore = new PlayerStore();
