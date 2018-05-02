import * as React from 'react';
import { Vector3 } from 'three';
import { clampByMin, clampByMax } from '~/utils';
import { Body, IStore as IBodyStore } from './body';
import { GRAVITY_FORCE, MAX_SPEED } from '~/constants';


interface IStore {
    acceleration: number;
    moveLeft: () => void;
    moveRight: () => void;
    jump: () => void;
    sit: () => void;
    instance?: IBodyStore;
}

const ACCELERATION = 0.05;

export const Store: IStore = {
    acceleration: ACCELERATION,
    instance: undefined,
    moveLeft() {
        if (this.instance) {
            this.instance.velocity.x = clampByMin(this.instance.velocity.x - this.acceleration, -MAX_SPEED);
        }
    },
    moveRight() {
        if (this.instance) {
            this.instance.velocity.x = clampByMax(this.instance.velocity.x + this.acceleration, MAX_SPEED);
        }
    },
    jump() {
        if (this.instance) {
            this.instance.velocity.y = clampByMax(this.instance.velocity.y + this.acceleration, MAX_SPEED);
        }
    },
    sit() {
        if (this.instance) {
            this.instance.velocity.y = clampByMin(this.instance.velocity.y - this.acceleration, -MAX_SPEED);
        }
    }
};

export function Player() {
    return (
        <Body
            getInstance={body => Store.instance = body}
            mass={2}
            position={new Vector3(0, 1, 0)}
            force={GRAVITY_FORCE}
        />
    );
}
