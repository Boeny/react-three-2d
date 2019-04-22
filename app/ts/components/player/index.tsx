import * as React from 'react';
import { Vector2 } from 'three';
import { Store as html } from '~/views/html/store';
import { Store as camera } from '../camera/store';
import { Store as movable } from '../movable/store';
import { PlayerStaticStore } from './store';
import { getDirection, add } from '~/utils';
import { VertDirection, Position, IStore } from './types';
import { State as CameraProps } from '../camera/types';
import { Camera } from '../camera';
import { MountAndInit } from '../mount-and-init';
import { MAX_SPEED, MIN_SPEED } from '~/constants';


const BORDER_PERCENT = 0.5;
const MAX_MOVE_SPEED = MAX_SPEED;
const MIN_MOVE_SPEED = 0;
const ACCELERATION = MIN_SPEED * 1.5;
const DECELERATION = MIN_SPEED * 1.05;


export function Player(props: CameraProps) {
    return (
        <MountAndInit
            component={<Camera {...props} />}
            onMount={() => movable.add({ onEveryTick: onEveryTick(PlayerStaticStore) })}
        />
    );
}

const onEveryTick = (store: IStore) => (deltaTime: number) => {
    // change position by velocity
    if (store.isMoving()) {
        store.velocity.add(getMovingAcceleration(
            store.moving,
            getDirection(store.state.rotation),
            ACCELERATION * deltaTime
        ));
    }
    let speed = store.velocity.length();
    if (store.velocity.x !== 0 || store.velocity.y !== 0) {
        speed = decreaseSpeed(speed, DECELERATION * deltaTime);
    }
    store.velocity.normalize().multiplyScalar(speed);
    if (speed > 0) {
        store.setPosition(add(store.state.position, store.velocity), onPositionUpdate);
    }
};

function decreaseSpeed(vel: number, acc: number): number {
    return vel > acc || vel < -acc ? Math.abs(vel - acc) : 0;
}

function getMovingAcceleration({ up, down }: VertDirection, direction: Vector2, acc: number): Vector2 {
    return direction.multiplyScalar(up ? acc : (down ? -acc : 0));
}


function onPositionUpdate(p: Position) {
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
