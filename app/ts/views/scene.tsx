import * as React from 'react';
import * as React3 from 'react3';
import { setCanvas, setCursor } from './html/actions';
import { setZoom as setCameraZoom, shiftPosition as moveCamera } from './camera/actions';
import { Camera } from './camera';
import { Ship } from '~/components';


type Vector2 = { x: number, y: number };
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
            onAnimate={() => null}
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
            dragStartingPoint = { x: e.clientX, y: e.clientY };
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
            dragStartingPoint = null;
            break;
        case MOUSE.right:
        case MOUSE.wheel:
            break;
    }
}

function onMouseMove(e: any) {
    if (dragStartingPoint && timer > TIMER_DELAY) {
        timer = 0;
        moveCamera(
            dragStartingPoint.x - e.clientX,
            -dragStartingPoint.y + e.clientY
        );
        dragStartingPoint = { x: e.clientX, y: e.clientY };
        return;
    }
    timer += 1;
}
