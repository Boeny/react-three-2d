import * as React from 'react';
import * as React3 from 'react3';
import { Vector2 } from 'three';
import { Store as CameraStore } from '~/components/camera/store';
import { setCanvas, setCursor } from './html/actions';
import {
    setZoom as setCameraZoom, shiftPosition as moveCamera, moveBySpeed as moveCameraWithSpeed
} from '~/components/camera/actions';
import { getMouseVector } from '~/utils';
import {
    decreaseSpeed as decreaseCameraSpeed, setSpeed as setCameraSpeed
} from '~/components/camera/utils/store';
import { Camera, Particles } from '~/components';


let mode: 'idle' | 'drag' | 'inertia' = 'idle';
let dragStartPoint: Vector2 | null = null;
let timer = 0;
const MOUSE = {
    left: 0,
    wheel: 1,
    right: 2
};
const TIMER_DELAY = 1;

export function App() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return (
        <React3
            mainCamera={'camera'}
            width={width}
            height={height}
            onAnimate={onUpdate}
            canvasRef={setCanvas}
            onWheel={onMouseWheel}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
        >
            <scene>
                <Camera />
                <Particles />
            </scene>
        </React3>
    );
}

function onMouseWheel(e: any) {
    setCameraZoom(e.deltaY);
}

function onMouseDown(e: any) {
    switch (e.button) {
        case MOUSE.left:
            if (mode === 'idle' || mode === 'inertia') {
                mode = 'drag';
                setCursor('pointer');
                dragStartPoint = getMouseVector(e);
                setCameraSpeed(null);
            }
            break;
        case MOUSE.right:
        case MOUSE.wheel:
            break;
    }
}

function onMouseUp(e: any) {
    switch (e.button) {
        case MOUSE.left:
            if (mode === 'drag') {
                if (dragStartPoint === null) {
                    return;
                }
                mode = 'inertia';
                setCursor('default');
                setCameraSpeed(dragStartPoint.sub(getMouseVector(e)));
                dragStartPoint = null;
            }
            break;
        case MOUSE.right:
        case MOUSE.wheel:
            break;
    }
}

function onMouseMove(e: any) {
    if (mode === 'drag') {
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

function onUpdate() {
    if (mode === 'inertia') {
        moveCameraWithSpeed();
        decreaseCameraSpeed();
        if (CameraStore.speed === null) {
            mode = 'idle';
        }
    }
}
