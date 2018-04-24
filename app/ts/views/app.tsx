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
import { Body, Store as bodies, IStore as IBodyStore, Position } from '~/components/body';


let mode: 'idle' | 'drag' | 'inertia' = 'idle';
let dragStartPoint: Vector2 | null = null;
let timer = 0;
const MOUSE = {
    left: 0,
    wheel: 1,
    right: 2
};
const TIMER_DELAY = 1;
const GRAV_V2 = { x: 0, y: -0.0001 };
// const GRAV_LENGTH = 0.001;


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
                <Body position={new Vector3(-5, 0, 0)} parent={{ x: 0, y: 0 }} />
                <Body position={new Vector3(-10, 0, 0)} />
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
        body = bodies[i];
        actual.x = body.state.x;
        actual.y = body.state.y;
        sign.x = body.velocity.x === 0 ? 0 : (body.velocity.x > 0 ? 1 : -1);
        sign.y = body.velocity.y === 0 ? 0 : (body.velocity.y > 0 ? 1 : -1);
        collisionDirection.x = sign.x === 0 ? '' : (sign.x > 0 ? 'right' : 'left');
        collisionDirection.y = sign.y === 0 ? '' : (sign.y > 0 ? 'top' : 'bottom');
        if (Math.abs(actual.x - body.x) > 1) {
            body.updateX(sign.x);// async
            actual.x += sign.x;
            body.x = actual.x;
            body.setCollision(collisionDirection.x, false);
        }
        if (Math.abs(actual.y - body.y) > 1) {
            body.updateY(sign.y);// async
            actual.y += sign.y;
            body.y = actual.y;
            body.setCollision(collisionDirection.y, false);
        }
        if (collisions) {
            if (particles[`${actual.x + sign.x}|${actual.y}`] === undefined) {
                body.velocity.x += GRAV_V2.x;
                body.x += body.velocity.x;
            } else {
                body.velocity.x = -body.velocity.x;
                body.setCollision(collisionDirection.x, true);
            }
            if (particles[`${actual.x}|${actual.y + sign.y}`] === undefined) {
                body.velocity.y += GRAV_V2.y;
                body.y += body.velocity.y;
            } else {
                body.velocity.y = -body.velocity.y;
                body.setCollision(collisionDirection.y, true);
            }
        } else {
            body.velocity.x += GRAV_V2.x;
            body.velocity.y += GRAV_V2.y;
        }
        if (body.parent) {
            dx = body.parent.x - body.x;
            dy = body.parent.y - body.y;
            dLength = Math.sqrt(dx * dx + dy * dy);
            gapLength = (dLength - body.distanceToParent) / dLength;
            body.velocity.x += dx * gapLength;
            body.velocity.y += dy * gapLength;
        }
    }
}

const actual: Position = { x: 0, y: 0 };
const sign: Position = { x: 0, y: 0 };
const collisionDirection = { x: '', y: '' };
let body: IBodyStore;
let dx = 0;
let dy = 0;
let gapLength = 0;
let dLength = 0;
const collisions = true;
