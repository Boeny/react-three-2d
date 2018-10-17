import { Vector2 } from 'three';
import { Store as camera } from '~/components/camera/store';
import { Store as player } from '~/components/player/store';
import { Store as events } from '~/components/events/store';
import { Store as movable } from '~/components/movable/store';
import { Store as entities } from '~/components/entities/store';
import { Store as html } from '~/views/html/store';
import { getMouseVector } from '~/utils';
import { getCollider } from '~/components/colliders/utils';
import { IStore as IBodyStore } from '~/components/body/types';
import { MOUSE, KEY } from '~/constants';


let dragStartPoint: Vector2 | null = null;

export function onWheel(e: MouseWheelEvent) {
    camera.updateZoomBy(e.deltaY, entities.getZoomNear(), entities.getZoomFar(), zoom => {
        camera.setRotation(entities.getRotationByZoom(zoom));
        camera.setTranslation(entities.getTranslationByRotation(camera.state.rotation));
    });
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
                // camera.setSpeed(new Vector2());
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
    // camera.setSpeed(dragStartPoint.sub(v));
    dragStartPoint = v;
}

export function onKeyDown(e: KeyboardEvent) {
    if (e.shiftKey) {
        events.setStepMode(false);
    }
    switch (e.key) {
        case KEY.LEFT:
            player.moveLeft(true);
            break;
        case KEY.RIGHT:
            player.moveRight(true);
            break;
        case KEY.UP:
            player.moveUp(true);
            break;
        case KEY.DOWN:
            player.moveDown(true);
            break;
        case KEY.SPACE:
            if (events.state.stepMode) {
                entities.nextStep();
            } else {
                events.setStepMode(true);
            }
            break;
        case KEY.ENTER:
            entities.nextMode();
            break;
        case 'v':
            entities.toggleNegative();
            break;
        case 's':
            entities.save();
            break;
    }
}

export function onKeyUp(e: KeyboardEvent) {
    switch (e.key) {
        case KEY.LEFT:
            player.moveLeft(false);
            break;
        case KEY.RIGHT:
            player.moveRight(false);
            break;
        case KEY.UP:
            player.moveUp(false);
            break;
        case KEY.DOWN:
            player.moveDown(false);
            break;
    }
    if (player.isMoving() === false) {
        // events.setStepMode(false);
    }
}

export function onAnimate() {
    for (let i = 0; i < movable.bodies.length; i += 1) {
        const body = movable.bodies[i];
        if (movable.isBody(body)) {
            checkCollision(body, 'x');
            checkCollision(body, 'y');
            body.onEveryTick && body.onEveryTick(body);
        } else {
            body.onEveryTick();
        }
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
    const velocityVector = coo === 'x' ? new Vector2(velocity, 0) : new Vector2(0, velocity);
    if (collider) {
        body.onCollide && body.onCollide(collider);
        collider.onCollide && collider.onCollide(body);
        if (collider.isMovable) {
            collider.setVelocity(velocity, coo);
            // body.changePosition(velocityVector);
            // body.setVelocity(0, coo);
        } else {
            body.setVelocity(0, coo);
        }
    } else {// free way
        body.onUnCollide && body.onUnCollide();
        body.changePosition(velocityVector);
        body.setVelocity(0, coo);
    }
}
