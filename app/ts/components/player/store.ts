import { observable, runInAction } from 'mobx';
import { IStore, Position } from './types';


export const Store: IStore = {
    moving: observable({
        left: false,
        right: false,
        up: false,
        down: false
    }),
    state: observable({
        position: { x: 0, y: 0 }
    }),
    setPosition(p: Position, after?: (p: Position) => void) {
        runInAction(() => {
            this.state.position = p;
            after && after(p);
        });
    },
    updatePositionBy(p: Position, after?: (p: Position) => void) {
        const { position } = this.state;
        this.setPosition(
            {
                x: position.x + p.x,
                y: position.y + p.y
            },
            after
        );
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
