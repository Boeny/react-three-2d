import { Vector2 } from 'three';
import { Store as camera } from '~/components/camera/store';
import { Store as player } from '~/components/player/store';
import { Store as movable } from '~/components/movable/store';
import { Store as html } from '~/views/html/store';
import { getMouseVector, toWorldVector, save, sub, length } from '~/utils';
import { MOUSE, KEY, MOUSE_DRAG_MODE_ENABLED, MAX_DISTANCE, MAX_MOVABLE_COUNT } from '~/constants';


let dragStartScreenVector: Vector2 | null = null;
let dragStartPoint: Vector2 | null = null;
// let dragStartObject: Intersection | null = null;
let mouseDragMode = false;

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
            if (mouseDragMode) {
                mouseDragMode = false;
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
    mouseDragMode = true;
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
            if (player.canStrike) {
                player.strike(true);
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
            player.strike(false);
            break;
    }
}

export function onAnimate() {
    const chance = Math.random() * MAX_DISTANCE;
    for (let i = 0, count = 0; i < movable.data.length && count < MAX_MOVABLE_COUNT; i += 1) {
        const item = movable.data[i];
        if (!item.state || length(sub(item.state.position, player.state.position)) < chance) {
            item.onEveryTick(1);
            count += 1;
        }
    }
}
