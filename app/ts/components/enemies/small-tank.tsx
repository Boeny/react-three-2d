import * as React from 'react';
import { Vector2, Vector3 } from 'three';
import { observer } from 'mobx-react';
import { Store as movable } from '../movable/store';
import { getPlayerStore } from '../player/store';
import { getSign } from '~/utils';
import { IStore as BulletsStore } from '../tank/bullet';
import { VertDirection, HorDirection } from '../player/types';
import { MountAndInit } from '../mount-and-init';
import { Tank } from '../tank';
import { MAX_SPEED, MIN_SPEED } from '../../constants';
import { STEPS_IN_UNIT, STEPS_IN_SINGLE_TRACK, TRACK_DISTANCE } from '../tank/constants';


const Store = getPlayerStore({
    position: { x: 0, y: 10 },
    rotation: -Math.PI / 2
});

const MAX_MOVE_SPEED = MAX_SPEED / 2;
const MIN_MOVE_SPEED = 0;
const ACCELERATION = MIN_SPEED * 1.5;
const DECELERATION = MIN_SPEED * 1.05;

const DEGREE = Math.PI / 180;
const MAX_ROT_SPEED = DEGREE * 5;
const MIN_ROT_SPEED = 0;
const ROT_SPEED_ACC = DEGREE * 1.25;
const ROT_SPEED_DEC = DEGREE * 1.05;

let offsetLeft = 1;
let offsetRight = 2;
let bullets: BulletsStore | null = null;

const Component = observer(() => {
    const { state, velocity } = Store;
    return (
        <Tank
            position={state.position}
            rotation={state.rotation}
            trackOffsetLeft={offsetLeft}
            trackOffsetRight={offsetRight}
            velocity={new Vector3(velocity.x, velocity.y, 0)}
            onBulletsRef={b => bullets = b}
        />
    );
});


export function SmallTank() {
    return (
        <MountAndInit
            component={<Component />}
            onMount={() => movable.add({ onEveryTick })}
        />
    );
}

function onEveryTick(deltaTime: number) {
    // shooting
    if (bullets && Store.canShoot) {
        bullets.add();
        Store.canShoot = false;
        setTimeout(() => Store.canShoot = true, 200);
    }
    // change position by velocity
    if (Store.isMoving()) {
        Store.velocity.add(getMovingAcceleration(Store.moving, Store.state.rotation));
    }
    let length = Store.velocity.length();
    if (Store.velocity.x !== 0 || Store.velocity.y !== 0) {
        length = decreaseSpeed(length, DECELERATION);
        Store.velocity.normalize().multiplyScalar(length);
    }
    if (length > MAX_MOVE_SPEED) {
        Store.velocity.normalize().multiplyScalar(MAX_MOVE_SPEED);
        length = MAX_MOVE_SPEED;
    } else if (length < MIN_MOVE_SPEED) {
        Store.velocity = new Vector2();
        length = 0;
    }
    if (length > 0) {
        Store.setPosition({
            x: Store.state.position.x + Store.velocity.x * deltaTime,
            y: Store.state.position.y + Store.velocity.y * deltaTime
        });
    }
    // calc track offset if we're moving
    let deltaOffset = Math.round(length * STEPS_IN_UNIT * deltaTime);
    if (length > 0) {
        if (Store.moving.up) {
            deltaOffset = STEPS_IN_SINGLE_TRACK - deltaOffset % STEPS_IN_SINGLE_TRACK;
        }
        offsetLeft = offsetRight = (offsetLeft + deltaOffset) % STEPS_IN_SINGLE_TRACK;
    }
    // change rotation by rotation speed
    if (Store.isRotating()) {
        Store.rotSpeed += getRotationAcceleration(Store.rotating);
    }
    const sign = getSign(Store.rotSpeed);
    length = Math.abs(Store.rotSpeed);
    if (Store.rotSpeed !== 0) {
        length = decreaseSpeed(length, ROT_SPEED_DEC);
        Store.rotSpeed = sign * length;
    }
    if (length > MAX_ROT_SPEED) {
        Store.rotSpeed = MAX_ROT_SPEED * sign;
        length = MAX_ROT_SPEED;
    } else if (length < MIN_ROT_SPEED) {
        Store.rotSpeed = 0;
        length = 0;
    }
    if (length > 0) {
        Store.setRotation(Store.state.rotation + Store.rotSpeed * deltaTime);
    }
    // calc track offset if we're rotating
    deltaOffset = Math.round(Math.tan(length * deltaTime) * TRACK_DISTANCE * STEPS_IN_UNIT);
    if (length > 0) {
        if (Store.rotating.left) {
            offsetLeft = (offsetLeft + (STEPS_IN_SINGLE_TRACK - deltaOffset % STEPS_IN_SINGLE_TRACK)) % STEPS_IN_SINGLE_TRACK;
            offsetRight = (offsetRight + deltaOffset) % STEPS_IN_SINGLE_TRACK;
        } else {
            offsetRight = (offsetRight + (STEPS_IN_SINGLE_TRACK - deltaOffset % STEPS_IN_SINGLE_TRACK)) % STEPS_IN_SINGLE_TRACK;
            offsetLeft = (offsetLeft + deltaOffset) % STEPS_IN_SINGLE_TRACK;
        }
    }
}

function decreaseSpeed(vel: number, acc: number): number {
    return vel > acc || vel < -acc ? Math.abs(vel - acc) : 0;
}

function getMovingAcceleration({ up, down }: VertDirection, rot: number): Vector2 {
    return (new Vector2(Math.cos(rot), Math.sin(rot)))
        .multiplyScalar(up ? ACCELERATION : (down ? -ACCELERATION : 0));
}

function getRotationAcceleration({ left, right }: HorDirection): number {
    return right ? -ROT_SPEED_ACC : (left ? ROT_SPEED_ACC : 0);
}
