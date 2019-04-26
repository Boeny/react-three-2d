import * as React from 'react';
import { Vector2 } from 'three';
import { Store as html } from '~/views/html/store';
import { Store as camera } from '../camera/store';
import { Store as movable } from '../movable/store';
import { PlayerStaticStore } from './store';
import { add } from '~/utils';
import { Position, IStore, Direction } from './types';
import { State as CameraProps } from '../camera/types';
import { Camera } from '../camera';
import { MountAndInit } from '../mount-and-init';


const BORDER_PERCENT = 0.01;
const ACCELERATION = 3;
const DECELERATION = 1.5;


export function Player(props: CameraProps) {
    return (
        <MountAndInit
            component={<Camera {...props} />}
            onMount={() => movable.add({ onEveryTick: onEveryTick(PlayerStaticStore) })}
        />
    );
}

const onEveryTick = (store: IStore) => (deltaTime: number) => {
    if (store.isMoving()) {
        store.velocity.add(getDirection(store.moving).multiplyScalar(ACCELERATION * deltaTime));
    }
    let speed = store.velocity.length();
    if (store.velocity.x !== 0 || store.velocity.y !== 0) {
        speed = decreaseSpeed(speed, DECELERATION * deltaTime);
    }
    store.velocity.normalize().multiplyScalar(speed);
    if (speed > 0) {
        const position = add(store.state.position, store.velocity);
        store.setPosition(position);
        cameraPositionUpdate(position);
    }
};

function getDirection({ up, down, left, right }: Direction): Vector2 {
    let x = 0;
    if (right) {
        x += 1;
    }
    if (left) {
        x -= 1;
    }
    let y = 0;
    if (up) {
        y += 1;
    }
    if (down) {
        y -= 1;
    }
    return (new Vector2(x, y)).normalize();
}

function decreaseSpeed(vel: number, acc: number): number {
    return vel > acc || vel < -acc ? Math.abs(vel - acc) : 0;
}


function cameraPositionUpdate(p: Position) {
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
