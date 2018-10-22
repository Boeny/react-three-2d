import { Vector2, Intersection, Scene } from 'three';
import { Store as camera } from '~/components/camera/store';
import { Store as player } from '~/components/player/store';
import { Store as events } from '~/components/events/store';
import { Store as movable } from '~/components/movable/store';
import { Store as entities } from '~/components/entities/store';
import { Store as html } from '~/views/html/store';
import { getMouseVector, toWorldVector, getSelectedObject } from '~/utils';
import { getCollider } from '~/components/colliders/utils';
import { IStore as IBodyStore } from '~/components/body/types';
import { MOUSE, KEY, MOUSE_DRAG_MODE_ENABLED } from '~/constants';


let dragStartScreenVector: Vector2 | null = null;
let dragStartPoint: Vector2 | null = null;
let dragStartObject: Intersection | null = null;

export function onWheel(e: MouseWheelEvent) {
    e.preventDefault();
    camera.updateZoomBy(e.deltaY, entities.getZoomNear(), entities.getZoomFar(), zoom => {
        camera.setRotation(entities.getRotationByZoom(zoom));
        camera.setTranslation(entities.getTranslationByRotation(camera.state.rotation));
    });
}

export function onMouseDown(e: MouseEvent) {
    switch (e.button) {
        case MOUSE.left:
            const { mode } = entities.state;
            if (camera.instance && mode > 0) {
                html.setCursor('pointer');
                dragStartScreenVector = getMouseVector(e);
                if (mode === 1) {
                    dragStartPoint = toWorldVector(dragStartScreenVector, camera.instance);
                } else {
                    dragStartObject = getSelectedObject(
                        dragStartScreenVector, camera.instance, camera.instance.parent as Scene
                    );
                }
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
            if (events.mouseDragMode) {
                events.setMouseDragMode(false);
            } else {
                if (dragStartPoint) {
                    entities.select(dragStartPoint.clone());
                }
                if (dragStartObject) {
                    entities.selectObject(dragStartObject.object);
                } else if (entities.state.selectedObjectPosition !== null) {
                    entities.selectObject(null);
                }
            }
            html.setCursor('default');
            dragStartPoint = null;
            dragStartObject = null;
            dragStartScreenVector = null;
            break;
        case MOUSE.right:
            break;
        case MOUSE.wheel:
            break;
    }
}

export function onMouseMove(e: MouseEvent) {
    if (
        MOUSE_DRAG_MODE_ENABLED === false || dragStartPoint === null
        || dragStartScreenVector === null || camera.instance === null
    ) {
        return;
    }
    const screenVector = getMouseVector(e);
    if (dragStartScreenVector.clone().sub(screenVector).length() < 2) {
        dragStartScreenVector = screenVector;
        return;
    }
    events.setMouseDragMode(true);
    const v = toWorldVector(screenVector, camera.instance);
    const diff = dragStartPoint.clone().sub(v);
    camera.updatePositionBy({ x: diff.x, y: diff.y, z: 0 });
    dragStartPoint = v;
    dragStartScreenVector = screenVector;
}

export function onKeyDown(e: KeyboardEvent) {
    e.preventDefault();
    if (e.shiftKey) {
        events.setStepMode(false);
    }
    switch (e.key) {
        case KEY.LEFT:
        case 'a':
        case 'ф':
            player.moveLeft(true);
            break;
        case KEY.RIGHT:
        case 'd':
        case 'в':
            player.moveRight(true);
            break;
        case KEY.UP:
        case 'w':
        case 'ц':
            player.moveUp(true);
            break;
        case KEY.DOWN:
        case 's':
        case 'ы':
            if (e.ctrlKey) {
                e.preventDefault();
                entities.save();
            } else {
                player.moveDown(true);
            }
            break;
        case KEY.SPACE:
            if (events.state.stepMode) {
                entities.nextStep();
            } else {
                events.setStepMode(true);
            }
            break;
        case KEY.ENTER:
            events.setStepMode(true);
            entities.nextMode();
            break;
        case 'v':
        case 'м':
            entities.toggleNegative();
            break;
        case 't':
        case 'е':
            entities.toggleStack();
            break;
    }
}

export function onKeyUp(e: KeyboardEvent) {
    switch (e.key) {
        case KEY.LEFT:
        case 'a':
        case 'ф':
            player.moveLeft(false);
            break;
        case KEY.RIGHT:
        case 'd':
        case 'в':
            player.moveRight(false);
            break;
        case KEY.UP:
        case 'w':
        case 'ц':
            player.moveUp(false);
            break;
        case KEY.DOWN:
        case 's':
        case 'ы':
            player.moveDown(false);
            break;
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
