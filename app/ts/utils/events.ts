import { Vector2 } from 'three';
import { Store as camera } from '~/components/camera/store';
import { Store as player } from '~/components/player/store';
import { Store as events } from '~/components/events/store';
import { Store as Movable } from '~/components/movable/store';
import { setCursor } from '~/views/html/actions';
import { setZoom as setCameraZoom } from '~/components/camera/actions';
import { getMouseVector } from '~/utils';
import { getCollider } from '~/components/body/utils';
import { IStore as IBodyStore } from '~/components/body/types';
import { MOUSE, KEY, TIMER_DELAY } from '~/constants';
import { CAMERA_STOPPING_SPEED } from '~/components/camera/constants';


let dragStartPoint: Vector2 | null = null;
let timer = 0;


export function onWheel(e: any) {
    setCameraZoom(e.deltaY);
}

export function onMouseDown(e: any) {
    switch (e.button) {
        case MOUSE.left:
            events.setMode('drag');
            setCursor('pointer');
            dragStartPoint = getMouseVector(e);
            break;
        case MOUSE.right:
            break;
        case MOUSE.wheel:
            break;
    }
}

export function onMouseUp(e: any) {
    switch (e.button) {
        case MOUSE.left:
            if (events.state.mouseMode === 'drag') {
                if (dragStartPoint === null) {
                    return;
                }
                events.setMode('idle');
                setCursor('default');
                camera.setSpeed(new Vector2());
                dragStartPoint = null;
            }
            break;
        case MOUSE.right:
            break;
        case MOUSE.wheel:
            break;
    }
}

export function onMouseMove(e: any) {
    if (events.state.mouseMode === 'drag') {
        if (dragStartPoint === null) {
            return;
        }
        if (timer > TIMER_DELAY) {
            timer = 0;
            const v = getMouseVector(e);
            camera.setSpeed(dragStartPoint.sub(v));
            dragStartPoint = v;
        } else {
            timer += 1;
        }
    }
}

export function onKeyDown(e: any) {
    switch (e.key) {
        case KEY.LEFT:
            player.moveLeft();
            break;
        case KEY.RIGHT:
            player.moveRight();
            break;
        case KEY.UP:
            player.moveUp();
            break;
        case KEY.DOWN:
            player.moveDown();
            break;
    }
}

export function onKeyUp(e: any) {
    switch (e.key) {
        case KEY.LEFT:
            player.stopMovingLeft();
            break;
        case KEY.RIGHT:
            player.stopMovingRight();
            break;
        case KEY.UP:
            player.stopMovingUp();
            break;
        case KEY.DOWN:
            player.stopMovingDown();
            break;
    }
}

export function onAnimate() {
    for (let i = 0; i < Movable.bodies.length; i += 1) {
        checkCollision(Movable.bodies[i], 'x');
        checkCollision(Movable.bodies[i], 'y');
    }
}

function checkCollision(body: IBodyStore, coo: 'x' | 'y') {
    const velocity = body.velocity[coo];
    if (velocity === 0) {
        return;
    }
    const collider = coo === 'x' ?
        getCollider(body.position.x + velocity, body.position.y) :
        getCollider(body.position.x, body.position.y + velocity);
    if (collider) {
        body.velocity[coo] = 0;
        return;
    }
    body.update(coo === 'x' ? new Vector2(velocity, 0) : new Vector2(0, velocity));
    if (body.name === 'camera') {
        if (velocity > 0) {
            body.velocity[coo] -= velocity > CAMERA_STOPPING_SPEED ? CAMERA_STOPPING_SPEED : 0;
        } else {
            body.velocity[coo] -= velocity < -CAMERA_STOPPING_SPEED ? -CAMERA_STOPPING_SPEED : 0;
        }
        return;
    }
    if (body.name === 'player' && camera.connected) {
        camera.updateConnected(coo === 'x' ? new Vector2(velocity, 0) : new Vector2(0, velocity));
    }
}
