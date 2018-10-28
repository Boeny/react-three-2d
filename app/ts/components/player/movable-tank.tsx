import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { Store as html } from '~/views/html/store';
import { Store as movable } from '../movable/store';
import { Store as camera } from '../camera/store';
import { Store as player } from './store';
import { getSign } from '~/utils';
import { Position } from '~/types';
import { VertDirection, HorDirection } from './types';
import { MountAndInit } from '../mount-and-init';
import { Tank } from '../tank';
import { MAX_SPEED, MIN_SPEED } from '../../constants';


const BORDER_PERCENT = 0.5;
const MAX_MOVE_SPEED = MAX_SPEED / 2;
const MIN_MOVE_SPEED = MIN_SPEED;
const ACCELERATION = MIN_SPEED * 2;
const DECELERATION = MIN_SPEED * 1.1;

const DEGREE = Math.PI / 180;
const MAX_ROT_SPEED = 10 * DEGREE;
const MIN_ROT_SPEED = DEGREE * 0;
const ROT_SPEED_ACC = DEGREE * 2;
const ROT_SPEED_DEC = DEGREE * 1.1;

const Component = observer(() => {
    return (
        <Tank
            position={player.state.position}
            rotation={player.state.rotation}
        />
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
    if (player.isMoving()) {
        player.velocity.add(getMovingAcceleration(player.moving, player.state.rotation));
    }
    let length = player.velocity.length();
    if (player.velocity.x !== 0 || player.velocity.y !== 0) {
        length = decreaseSpeed(length, DECELERATION * deltaTime);
        player.velocity.normalize().multiplyScalar(length);
    }
    if (length > MAX_MOVE_SPEED) {
        player.velocity.normalize().multiplyScalar(MAX_MOVE_SPEED);
    } else if (length < MIN_MOVE_SPEED) {
        player.velocity.normalize().multiplyScalar(MIN_MOVE_SPEED);
    }
    player.setPosition(
        {
            x: player.state.position.x + player.velocity.x,
            y: player.state.position.y + player.velocity.y
        },
        onPlayerPositionUpdate
    );

    if (player.isRotating()) {
        player.rotSpeed += getRotationAcceleration(player.rotating);
    }
    const sign = getSign(player.rotSpeed);
    length = Math.abs(player.rotSpeed);
    if (player.rotSpeed !== 0) {
        length = decreaseSpeed(length, ROT_SPEED_DEC * deltaTime);
        player.rotSpeed = sign * length;
    }
    if (length > MAX_ROT_SPEED) {
        player.rotSpeed = MAX_ROT_SPEED * sign;
    } else if (length < MIN_ROT_SPEED) {
        player.rotSpeed = MIN_ROT_SPEED * sign;
    }
    player.setRotation(player.state.rotation + player.rotSpeed);
}

function decreaseSpeed(vel: number, acc: number): number {
    return vel > acc || vel < -acc ? vel - acc : 0;
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