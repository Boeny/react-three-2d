import * as React from 'react';
import { Vector2, Vector3 } from 'three';
import { observer } from 'mobx-react';
import { Store as html } from '~/views/html/store';
import { Store as movable } from '../movable/store';
import { Store as camera } from '../camera/store';
import { Store as bullets } from '../tank/bullet';
import { Store as player } from './store';
import { getSign } from '~/utils';
import { Position } from '~/types';
import { VertDirection, HorDirection } from './types';
import { MountAndInit } from '../mount-and-init';
import { Tank } from '../tank';
import { MAX_SPEED, MIN_SPEED } from '../../constants';
import { STEPS_IN_UNIT, STEPS_IN_SINGLE_TRACK, TRACK_DISTANCE } from '../tank/constants';


const BORDER_PERCENT = 0.5;
const MAX_MOVE_SPEED = MAX_SPEED / 2;
const MIN_MOVE_SPEED = 0;
const ACCELERATION = MIN_SPEED * 1.5;
const DECELERATION = MIN_SPEED * 1.05;

const DEGREE = Math.PI / 180;
const MAX_ROT_SPEED = DEGREE * 5;
const MIN_ROT_SPEED = 0;
const ROT_SPEED_ACC = DEGREE * 1.25;
const ROT_SPEED_DEC = DEGREE * 1.05;

let offsetLeft = 0;
let offsetRight = 0;

const Component = observer(() => {
    const { state, velocity } = player;
    return (
        <group name={'player'}>
            <Tank
                position={state.position}
                rotation={state.rotation}
                trackOffsetLeft={offsetLeft}
                trackOffsetRight={offsetRight}
                velocity={new Vector3(velocity.x, velocity.y, 0)}
            />
        </group>
    );
});


export function MovableTank() {
    return (
        <MountAndInit
            component={<Component />}
            onMount={() => movable.add({ onEveryTick })}
        />
    );
}

function onEveryTick(deltaTime: number) {
    // shooting
    if (player.canShoot && player.isShooting) {
        bullets.add();
        player.canShoot = false;
        setTimeout(() => player.canShoot = true, 200);
    }
    // change position by velocity
    if (player.isMoving()) {
        player.velocity.add(getMovingAcceleration(player.moving, player.state.rotation));
    }
    let length = player.velocity.length();
    if (player.velocity.x !== 0 || player.velocity.y !== 0) {
        length = decreaseSpeed(length, DECELERATION);
        player.velocity.normalize().multiplyScalar(length);
    }
    if (length > MAX_MOVE_SPEED) {
        player.velocity.normalize().multiplyScalar(MAX_MOVE_SPEED);
        length = MAX_MOVE_SPEED;
    } else if (length < MIN_MOVE_SPEED) {
        player.velocity = new Vector2();
        length = 0;
    }
    if (length > 0) {
        player.setPosition(
            {
                x: player.state.position.x + player.velocity.x * deltaTime,
                y: player.state.position.y + player.velocity.y * deltaTime
            },
            onPlayerPositionUpdate
        );
    }
    // calc track offset if we're moving
    let deltaOffset = Math.round(length * STEPS_IN_UNIT * deltaTime);
    if (length > 0) {
        if (player.moving.up) {
            deltaOffset = STEPS_IN_SINGLE_TRACK - deltaOffset % STEPS_IN_SINGLE_TRACK;
        }
        offsetLeft = offsetRight = (offsetLeft + deltaOffset) % STEPS_IN_SINGLE_TRACK;
    }
    // change rotation by rotation speed
    if (player.isRotating()) {
        player.rotSpeed += getRotationAcceleration(player.rotating);
    }
    const sign = getSign(player.rotSpeed);
    length = Math.abs(player.rotSpeed);
    if (player.rotSpeed !== 0) {
        length = decreaseSpeed(length, ROT_SPEED_DEC);
        player.rotSpeed = sign * length;
    }
    if (length > MAX_ROT_SPEED) {
        player.rotSpeed = MAX_ROT_SPEED * sign;
        length = MAX_ROT_SPEED;
    } else if (length < MIN_ROT_SPEED) {
        player.rotSpeed = 0;
        length = 0;
    }
    if (length > 0) {
        player.setRotation(player.state.rotation + player.rotSpeed * deltaTime);
    }
    // calc track offset if we're rotating
    deltaOffset = Math.round(Math.tan(length * deltaTime) * TRACK_DISTANCE * STEPS_IN_UNIT);
    if (length > 0) {
        if (player.rotating.left) {
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

function onPlayerPositionUpdate(p: Position) {
    const { position } = camera.state;
    const { windowWidth, windowHeight } = html.state;
    const xBorder = camera.state.zoom * BORDER_PERCENT;
    const yBorder = xBorder * windowHeight / windowWidth;
    const dx = p.x - position.x;
    const dy = p.y - position.y;
    const diff = {
        x: Math.abs(dx) > xBorder ? (dx > 0 ? dx - xBorder : dx + xBorder) : 0,
        y: Math.abs(dy) > yBorder ? (dy > 0 ? dy - yBorder : dy + yBorder) : 0
    };
    if (diff.x === 0 && diff.y === 0) {
        return;
    }
    camera.updatePositionBy({
        x: diff.x,
        y: diff.y,
        z: 0
    });
}
