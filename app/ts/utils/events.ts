import { Vector2 } from 'three';
import { Store as camera } from '~/components/camera/store';
import { Store as player } from '~/components/player/store';
import { Store as events } from '~/components/events/store';
import { Store as movable } from '~/components/movable/store';
import { Store as html } from '~/views/html/store';
import { getMouseVector } from '~/utils';
import { getCollider } from '~/components/colliders/utils';
import { IStore as IBodyStore } from '~/components/body/types';
import { MOUSE, KEY } from '~/constants';


let dragStartPoint: Vector2 | null = null;

export function onWheel(e: MouseWheelEvent) {
    camera.setZoom(e.deltaY);
}

export function onMouseDown(e: MouseEvent) {
    switch (e.button) {
        case MOUSE.left:
            if (events.setMouseDragMode(true)) {
                html.setCursor('pointer');
                dragStartPoint = getMouseVector(e);
            }
            break;
        case MOUSE.right:
            break;
        case MOUSE.wheel:
            break;
    }
}

export function onMouseUp(e: MouseEvent) {
    switch (e.button) {
        case MOUSE.left:
            if (dragStartPoint === null || events.state.mouseDragMode === false) {
                return;
            }
            if (events.setMouseDragMode(false)) {
                html.setCursor('default');
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

export function onMouseMove(e: MouseEvent) {
    if (dragStartPoint === null || events.state.mouseDragMode === false) {
        return;
    }
    const v = getMouseVector(e);
    camera.setSpeed(dragStartPoint.sub(v));
    dragStartPoint = v;
}

export function onKeyDown(e: KeyboardEvent) {
    if (e.shiftKey) {
        events.setStepMode(true);
    }
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

export function onKeyUp(e: KeyboardEvent) {
    events.setStepMode(false);
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
    for (let i = 0; i < movable.bodies.length; i += 1) {
        const body = movable.bodies[i];
        checkCollision(body, 'x');
        checkCollision(body, 'y');
        body.onEveryTick && body.onEveryTick(body);
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
        body.onVelocityChange && body.onVelocityChange(body.velocity);
        if (body.name === 'player') {
            html.setContent(collider);
        }
        return;
    }
    if (body.name === 'player') {
        html.setContent(null);
    }
    body.update(coo === 'x' ? new Vector2(velocity, 0) : new Vector2(0, velocity));
    if (body.name === 'player' && camera.connected) {
        camera.updateConnected(coo === 'x' ? new Vector2(velocity, 0) : new Vector2(0, velocity));
    }
    if (events.state.stepMode) {
        body.velocity[coo] = 0;
        body.onVelocityChange && body.onVelocityChange(body.velocity);
    }
}
