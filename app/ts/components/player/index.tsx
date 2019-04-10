import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { Store as html } from '~/views/html/store';
import { Store as camera } from '../camera/store';
import { Store as movable } from '../movable/store';
import { getDirection, add } from '~/utils';
import { PlayerStore } from './store';
import { State as CameraProps } from '../camera/types';
import { Camera } from '../camera';
import { MAX_SPEED, MIN_SPEED } from '~/constants';
import { VertDirection, Position } from './types';



const BORDER_PERCENT = 0.5;
const MAX_MOVE_SPEED = MAX_SPEED / 2;
const MIN_MOVE_SPEED = 0;
const ACCELERATION = MIN_SPEED * 1.5;
const DECELERATION = MIN_SPEED * 1.05;


export const Player = observer((props: CameraProps) => {
    React.useEffect(() => {
        movable.add({ onEveryTick: onEveryTick(new PlayerStore()) });
    });
    return (
        <Camera {...props} />
    );
});;

const onEveryTick = (store: PlayerStore) => (deltaTime: number) => {
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
    speed = clampSpeed(speed, MIN_MOVE_SPEED * deltaTime, MAX_MOVE_SPEED * deltaTime);
    store.velocity.normalize().multiplyScalar(speed);
    if (speed > 0) {
        store.setPosition(add(store.state.position, store.velocity), onPositionUpdate);
    }
};

function clampSpeed(speed: number, min: number, max: number): number {
    if (speed > max) {
        return max;
    }
    if (speed < min) {
        return 0;
    }
    return speed;
}

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
