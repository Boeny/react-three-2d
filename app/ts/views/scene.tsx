import * as React from 'react';
import * as React3 from 'react3';
import { Vector2 } from 'three';
import { setCanvas, setCursor } from './html/actions';
import {
    setZoom as setCameraZoom, shiftPosition as moveCamera, decSpeed as decreaseCameraSpeed,
    setSpeed as setCameraSpeed, moveBySpeed as moveCameraWithSpeed
} from './camera/actions';
import { getMouseVector } from '~/utils';
import { Camera } from './camera';
import { Ship } from '~/components';


let dragStartingPoint: Vector2 | null = null;
let timer = 0;
const MOUSE = {
    left: 0,
    wheel: 1,
    right: 2
};
const TIMER_DELAY = 1;

export function Scene() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return (
        <React3
            mainCamera={'camera'} // this points to the perspectiveCamera which has the name set to "camera" below
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
                <Ship />
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
            setCursor('pointer');
            dragStartingPoint = getMouseVector(e);
            break;
        case MOUSE.right:
        case MOUSE.wheel:
            break;
    }
}

function onMouseUp(e: any) {
    switch (e.button) {
        case MOUSE.left:
            setCursor('default');
            if (dragStartingPoint) {
                setCameraSpeed(getMouseVector(e).sub(dragStartingPoint));
                dragStartingPoint = null;
            }
            break;
        case MOUSE.right:
        case MOUSE.wheel:
            break;
    }
}

function onMouseMove(e: any) {
    if (dragStartingPoint && timer > TIMER_DELAY) {
        timer = 0;
        const v = getMouseVector(e);
        moveCamera(dragStartingPoint.sub(v));
        dragStartingPoint = v;
        return;
    }
    timer += 1;
}

function onUpdate() {
    decreaseCameraSpeed();
    moveCameraWithSpeed();
}
