import { Vector2 } from 'three';
import { observable, action } from 'mobx';
import { IStore, Position, State } from './types';


export class PlayerStore implements IStore {
    @observable
    moving = {
        up: false,
        down: false,
        left: false,
        right: false
    };

    @observable
    rotating = {
        left: false,
        right: false
    };

    @observable
    state: State = {
        position: { x: 0, y: 0 },
        rotation: 0
    };

    velocity = new Vector2();
    rotSpeed = 0;

    constructor(state?: State) {
        state && this.setState(state);
    }

    @action
    setState(state: State) {
        this.state = state;
    }

    @action
    setPosition(p: Position) {
        this.state.position = p;
    }

    @action
    rotateRight(v: boolean) {
        if (this.rotating.right !== v) {
            this.rotating.right = v;
        }
    }

    @action
    rotateLeft(v: boolean) {
        if (this.rotating.left !== v) {
            this.rotating.left = v;
        }
    }

    @action
    moveForward(v: boolean) {
        if (this.moving.up !== v) {
            this.moving.up = v;
        }
    }

    @action
    moveBack(v: boolean) {
        if (this.moving.down !== v) {
            this.moving.down = v;
        }
    }

    @action
    moveRight(v: boolean) {
        if (this.moving.right === v) {
            return;
        }
        this.moving.right = v;
    }

    @action
    moveLeft(v: boolean) {
        if (this.moving.left === v) {
            return;
        }
        this.moving.left = v;
    }

    isMoving(): boolean {
        return this.moving.up || this.moving.down || this.moving.left || this.moving.right;
    }

    isRotating(): boolean {
        return this.rotating.right || this.rotating.left;
    }
}

export const PlayerStaticStore: IStore = new PlayerStore({
    position: { x: 0, y: 0 },
    rotation: Math.PI / 2
});
