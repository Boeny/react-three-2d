import { Vector2 } from 'three';
import { observable, action } from 'mobx';
// import { Store as movable } from '../movable/store';
// import { getDifficultyLevel } from '~/utils';
import { IStore, Position, State } from './types';


export class PlayerStore implements IStore {
    @observable
    moving = {
        up: false,
        down: false
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
    setPosition(p: Position, after?: (p: Position) => void) {
        this.state.position = p;
        after && after(p);
    }

    @action
    setRotation(v: number) {
        this.state.rotation = v;
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
    rotate(v: 'left' | 'right' | 'none') {
        this.rotating.left = v === 'left';
        this.rotating.right = v === 'right';
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

    isMoving(): boolean {
        return this.moving.up || this.moving.down;
    }

    isRotating(): boolean {
        return this.rotating.right || this.rotating.left;
    }
}

export const PlayerStaticStore: IStore = new PlayerStore({
    position: { x: 0, y: 0 },
    rotation: Math.PI / 2
});
