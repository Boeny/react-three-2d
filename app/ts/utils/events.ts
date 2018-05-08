import { Vector2 } from 'three';
import { Store as camera } from '~/components/camera/store';
import { Store as player } from '~/components/player/store';
import { Store as events } from '~/components/events/store';
import { Store as movable } from '~/components/movable/store';
import { Store as html } from '~/views/html/store';
import { getMouseVector, toScreenVector } from '~/utils';
import { getCollider } from '~/components/colliders/utils';
import { IStore as IBodyStore } from '~/components/body/types';
import { MOUSE, KEY } from '~/constants';


let dragStartPoint: Vector2 | null = null;

export function onWheel(e: any) {
    camera.setZoom(e.deltaY);
}

export function onMouseDown(e: any) {
    switch (e.button) {
        case MOUSE.left:
            events.setMouseMode('drag');
            html.setCursor('pointer');
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
            if (dragStartPoint === null) {
                return;
            }
            events.setMouseMode('idle');
            html.setCursor('default');
            camera.setSpeed(new Vector2());
            dragStartPoint = null;
            break;
        case MOUSE.right:
            break;
        case MOUSE.wheel:
            break;
    }
}

export function onMouseMove(e: any) {
    if (dragStartPoint === null || events.state.mouseMode !== 'drag') {
        return;
    }
    const v = getMouseVector(e);
    camera.setSpeed(dragStartPoint.sub(v));
    dragStartPoint = v;
}

export function onKeyDown(e: KeyboardEvent) {
    if (e.shiftKey) {
        events.setKeyMode('step');
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
    events.setKeyMode('idle');
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
        checkCollision(movable.bodies[i], 'x');
        checkCollision(movable.bodies[i], 'y');
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
        html.setContent({
            name: collider.name,
            position: toScreenVector(new Vector2(
                collider.position.x - body.position.x,
                collider.position.y - body.position.y
            ))
        });
        return;
    }
    html.setContent(null);
    body.update(coo === 'x' ? new Vector2(velocity, 0) : new Vector2(0, velocity));
    if (body.name === 'player' && camera.connected) {
        camera.updateConnected(coo === 'x' ? new Vector2(velocity, 0) : new Vector2(0, velocity));
    }
    if (events.state.keyMode === 'step') {
        body.velocity[coo] = 0;
    }
}
