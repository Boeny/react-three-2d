import * as React from 'react';
import * as React3 from 'react3';
import { setCanvas, setCursor } from './html/actions';
import { Ship } from '~/components';
import { setZoom as setCameraZoom, shiftPosition as moveCamera } from './camera/actions';
import { Camera } from './camera';


type Vector2 = { x: number, y: number };
let dragStartingPoint: Vector2 | null = null;
let timer = 0;
const WHEEL = 1;
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
                <Ship radius={1000}/>
            </scene>
        </React3>
    );
}

function onMouseWheel(e: any) {
    setCameraZoom(e.deltaY);
}

function onMouseDown(e: any) {
    if (e.button === WHEEL) {
        onMiddleMouseDown({ x: e.clientX, y: e.clientY });
    }
}

function onMouseUp(e: any) {
    if (e.button === WHEEL) {
        onMiddleMouseUp();
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


function onMiddleMouseDown(point: Vector2) {
    setCursor('pointer');
    dragStartingPoint = point;
}

function onMiddleMouseUp() {
    setCursor('default');
    dragStartingPoint = null;
}
