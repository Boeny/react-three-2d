import { Vector2, Intersection } from 'three';
import { Store as camera } from '~/components/camera/store';
import { PlayerStaticStore as player } from '~/components/player/store';
import { selectObject } from '~/components/map/store';
import { Store as movable } from '~/components/movable/store';
import { Store as html } from '~/views/html/store';
import { getMouseVector, save, getSelectedObjectFromCamera } from '~/utils';
import { MOUSE, KEY } from '~/constants';


let dragStartScreenVector: Vector2 | null = null;
let dragStartObject: Intersection | null = null;

export function onWheel(e: MouseWheelEvent) {
    e.preventDefault();
    camera.updateZoomBy(e.deltaY);
}

const ENABLED_MOUSE_BUTTONS = [MOUSE.left, MOUSE.right];

export function onMouseDown(e: MouseEvent) {
    if (ENABLED_MOUSE_BUTTONS.indexOf(e.button) === -1) {
        return;
    }
    if (!camera.instance) {
        return;
    }
    html.setCursor('pointer');
    e.preventDefault();
    const screenPos = getMouseVector(e);
    switch (e.button) {
        case MOUSE.left:
            dragStartObject = getSelectedObjectFromCamera(screenPos, 'star');
            selectObject(dragStartObject ? dragStartObject.object : null);
            break;
        case MOUSE.right:
            dragStartScreenVector = screenPos;
            break;
    }
}

export function onMouseUp(e: MouseEvent) {
    if (ENABLED_MOUSE_BUTTONS.indexOf(e.button) === -1) {
        return;
    }
    html.setCursor('default');
    switch (e.button) {
        case MOUSE.right:
            dragStartScreenVector = null;
            break;
    }
}

export function onMouseMove(e: MouseEvent) {
    if (dragStartScreenVector === null || camera.instance === null) {
        return;
    }
    const screenVector = getMouseVector(e);
    if (dragStartScreenVector.clone().sub(screenVector).length() < 2) {
        dragStartScreenVector = screenVector;
        return;
    }
    const diff = screenVector.clone().sub(dragStartScreenVector);
    camera.updatePositionBy({ x: diff.x, y: diff.y, z: 0 });
    dragStartScreenVector = screenVector;
}

export function onKeyDown(e: KeyboardEvent) {
    e.preventDefault();
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
            player.moveForward(true);
            break;
        case KEY.DOWN:
            player.moveBack(true);
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
            player.moveForward(false);
            break;
        case KEY.DOWN:
        case 's':
        case 'ы':
            player.moveBack(false);
            break;
    }
}


let time = (new Date()).getTime();

export function onAnimate() {
    const now = (new Date()).getTime();
    const delta = (now - time) / 1000;
    movable.data.forEach(item => item.onEveryTick(delta));
    time = now;
}
