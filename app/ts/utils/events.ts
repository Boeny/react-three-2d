import { Vector2 } from 'three';
import { Store as camera } from '~/components/camera/store';
import { Store as player } from '~/components/player/store';
import { Store as events } from '~/components/events/store';
import { setCursor } from '~/views/html/actions';
import { setZoom as setCameraZoom } from '~/components/camera/actions';
import { getMouseVector } from '~/utils';
import { getCollider } from '~/components/body/utils';
import { IStore as IBodyStore } from '~/components/body/types';
import { Movable } from '~/components/body/constants';
import { MOUSE, KEY, TIMER_DELAY } from '~/constants';


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
            camera.setSpeed(new Vector2());
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
    for (let i = 0; i < Movable.length; i += 1) {
        const body = Movable[i];
        checkCollision(body, 'x');
        checkCollision(body, 'y');
    }
}

function checkCollision(body: IBodyStore, coo: 'x' | 'y') {
    const velocity = body.velocity[coo];
    const collider = coo === 'x' ?
        getCollider(body.position.x + velocity, body.position.y) :
        getCollider(body.position.x, body.position.y + velocity);
    if (body.velocity[coo] === 0 || collider) {
        return;
    }
    body.update(coo === 'x' ? new Vector2(velocity, 0) : new Vector2(0, velocity));
    if (body.name !== 'player' || !camera.connected) {
        return;
    }
    camera.updateConnected(coo === 'x' ? new Vector2(velocity, 0) : new Vector2(0, velocity));
}
