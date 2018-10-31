import { Vector2 } from 'three';
import { Store as camera } from '~/components/camera/store';
import { Store as player } from '~/components/player/store';
import { Store as events } from '~/components/events/store';
import { Store as movable } from '~/components/movable/store';
import { Store as html } from '~/views/html/store';
import { getMouseVector, toWorldVector, save } from '~/utils';
import { getCollider } from '~/components/colliders/utils';
import { IStore as IBodyStore } from '~/components/body/types';
import { MOUSE, KEY, MOUSE_DRAG_MODE_ENABLED } from '~/constants';


let dragStartScreenVector: Vector2 | null = null;
let dragStartPoint: Vector2 | null = null;
// let dragStartObject: Intersection | null = null;

export function onWheel(e: MouseWheelEvent) {
    e.preventDefault();
    camera.updateZoomBy(e.deltaY);
}

export function onMouseDown(e: MouseEvent) {
    switch (e.button) {
        case MOUSE.left:
            if (camera.instance) {
                html.setCursor('pointer');
                dragStartScreenVector = getMouseVector(e);
                /*if (mode === 1) {
                    dragStartPoint = toWorldVector(dragStartScreenVector);
                } else {
                    dragStartObject = getSelectedObjectFromCamera(dragStartScreenVector);
                }*/
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
                /*if (dragStartPoint) {
                    entities.select(dragStartPoint.clone());
                }
                if (dragStartObject) {
                    entities.selectObject(dragStartObject.object);
                } else if (entities.state.selectedObjectPosition !== null) {
                    entities.selectObject(null);
                }*/
            }
            html.setCursor('default');
            dragStartPoint = null;
            // dragStartObject = null;
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
    const v = toWorldVector(screenVector);
    const diff = dragStartPoint.clone().sub(v);
    camera.updatePositionBy({ x: diff.x, y: diff.y, z: 0 });
    dragStartPoint = v;
    dragStartScreenVector = screenVector;
}

export function onKeyDown(e: KeyboardEvent) {
    e.preventDefault();
    switch (e.key) {
        case KEY.LEFT:
        case 'a':
        case 'ф':
            player.rotateLeft(true);
            break;
        case KEY.RIGHT:
        case 'd':
        case 'в':
            player.rotateRight(true);
            break;
        case KEY.UP:
        case 'w':
        case 'ц':
            player.moveForward(true);
            break;
        case KEY.DOWN:
            if (!e.ctrlKey) {
                player.moveBack(true);
            }
            break;
        case 's':
        case 'ы':
            if (e.ctrlKey) {
                e.preventDefault();
                save();
            } else {
                player.moveBack(true);
            }
            break;
        case KEY.SPACE:
            if (player.canShoot) {
                player.isShooting = true;
            }
            break;
    }
}

export function onKeyUp(e: KeyboardEvent) {
    switch (e.key) {
        case KEY.LEFT:
        case 'a':
        case 'ф':
            player.rotateLeft(false);
            break;
        case KEY.RIGHT:
        case 'd':
        case 'в':
            player.rotateRight(false);
            break;
        case KEY.UP:
        case 'w':
        case 'ц':
            player.moveForward(false);
            break;
        case KEY.DOWN:
        case 's':
        case 'ы':
            player.moveBack(false);
            break;
        case KEY.SPACE:
            player.isShooting = false;
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
            body.onEveryTick(1);
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
        body.updatePositionBy(velocityVector);
        body.setVelocity(0, coo);
    }
}
