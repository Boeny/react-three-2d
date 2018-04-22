import * as React from 'react';
import * as React3 from 'react3';
import { Vector2, Vector3 } from 'three';
import { Store as CameraStore } from '~/components/camera/store';
import { setCanvas, setCursor } from './html/actions';
import {
    setZoom as setCameraZoom, shiftPosition as moveCamera, moveBySpeed as moveCameraWithSpeed
} from '~/components/camera/actions';
import { getMouseVector } from '~/utils';
import {
    decreaseSpeed as decreaseCameraSpeed, setSpeed as setCameraSpeed
} from '~/components/camera/utils/store';
import { Camera } from '~/components';
import { Particles, particles } from '~/components/particles';
import { Body, Store as bodies, IStore as IBodyStore } from '~/components/body';


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
                <Body position={new Vector3(-4, 0, 0)} />
                <Body position={new Vector3(-2, -2, 0)} />
                <Body position={new Vector3(0, -4, 0)} />
                <Body position={new Vector3(2, -6, 0)} />
                <Body position={new Vector3(4, -9, 0)} />
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
    for (let i = 0; i < bodies.length; i += 1) {
        // TODO: if (result force === 0) return;
        body = bodies[i];
        actualX = body.state.x;
        actualY = body.state.y;
        sign = body.velocity > 0 ? 1 : -1;
        if (Math.abs(body.x - actualX) > 1) {
            body.updateX(1);// async
            actualX += 1;
            body.x = actualX;
        }
        if (Math.abs(body.y - actualY) > 1) {
            body.updateY(sign);// async
            actualY += sign;
            body.y = actualY;
            body.setCollision('bottom', false);
        }
        if (particles[`${actualX}|${actualY + sign}`] === undefined) {
            body.y += body.velocity;
            body.velocity += -0.001;
        } else {
            body.velocity = -body.velocity;
            body.setCollision('bottom', true);
        }
    }
}

let actualX = 0;
let actualY = 0;
let sign = 0;
let body: IBodyStore;
