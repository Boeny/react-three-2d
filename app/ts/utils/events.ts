import { Vector2 } from 'three';
import { Store as camera } from '~/components/camera/store';
import { Store as player } from '~/components/player/store';
import { setCursor } from '~/views/html/actions';
import {
    setZoom as setCameraZoom, updatePosition as moveCamera, moveBySpeed as moveCameraWithSpeed
} from '~/components/camera/actions';
import { getMouseVector } from '~/utils';
import { getStatic } from '~/components/body/utils';
import { Bodies } from '~/components/body/constants';
import { MOUSE, KEY, TIMER_DELAY } from '~/constants';


let mouseMode: 'idle' | 'drag' | 'inertia' | 'target' = 'idle';
let dragStartPoint: Vector2 | null = null;
let timer = 0;


export function onWheel(e: any) {
    setCameraZoom(e.deltaY);
}

export function onMouseDown(e: any) {
    switch (e.button) {
        case MOUSE.left:
            mouseMode = 'drag';
            setCursor('pointer');
            dragStartPoint = getMouseVector(e);
            camera.setSpeed(null);
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
            if (mouseMode === 'drag') {
                if (dragStartPoint === null) {
                    return;
                }
                mouseMode = 'inertia';
                setCursor('default');
                camera.setSpeed(dragStartPoint.sub(getMouseVector(e)));
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
    if (mouseMode === 'drag') {
        if (dragStartPoint === null) {
            return;
        }
        if (timer > TIMER_DELAY) {
            timer = 0;
            const v = getMouseVector(e);
            moveCamera(dragStartPoint.sub(v));
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
        case KEY.RIGHT:
            player.stopX();
            break;
        case KEY.UP:
        case KEY.DOWN:
            player.stopY();
            break;
    }
}

export function onAnimate() {
    if (mouseMode === 'inertia') {
        moveCameraWithSpeed();
        camera.decreaseSpeed();
        if (camera.speed === null) {
            mouseMode = 'idle';
        }
    }
    for (let i = 0; i < Bodies.length; i += 1) {
        const body = Bodies[i];
        if (body.velocity.x !== 0 && !getStatic(body.position.x + body.velocity.x, body.position.y)) {
            body.update(new Vector2(body.velocity.x, 0));
        }
        if (body.velocity.y !== 0 && !getStatic(body.position.x, body.position.y + body.velocity.y)) {
            body.update(new Vector2(0, body.velocity.y));
        }
    }
}
