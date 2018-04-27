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
import { Particles } from '~/components/particles';
import {
    Body, Bodies as bodies, IStore as IBodyStore, Position, getStatic, delStatic, setStatic
} from '~/components/body';


let mouseMode: 'idle' | 'drag' | 'inertia' | 'target' = 'idle';
let dragStartPoint: Vector2 | null = null;
let timer = 0;
const MOUSE = {
    left: 0,
    wheel: 1,
    right: 2
};
const TIMER_DELAY = 1;
const MAX_SPEED = 1;
const HEAT_ENERGY = 0.001;
const LOOSING_COEF = 1 - HEAT_ENERGY;
const GRAV_STRENGTH = 0.001;
const GRAVITY_FORCE = { x: 0, y: -GRAV_STRENGTH };


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
                <Body
                    position={new Vector3(-5, 0, 0)}
                    force={GRAVITY_FORCE}
                />
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
            mouseMode = 'drag';
            setCursor('pointer');
            dragStartPoint = getMouseVector(e);
            setCameraSpeed(null);
            break;
        case MOUSE.right:
            mouseMode = 'target';
            break;
        case MOUSE.wheel:
            break;
    }
}

function onMouseUp(e: any) {
    switch (e.button) {
        case MOUSE.left:
            if (mouseMode === 'drag') {
                if (dragStartPoint === null) {
                    return;
                }
                mouseMode = 'inertia';
                setCursor('default');
                setCameraSpeed(dragStartPoint.sub(getMouseVector(e)));
                dragStartPoint = null;
            }
            break;
        case MOUSE.right:
            if (mouseMode === 'target') {
                mouseMode = 'idle';
            }
            break;
        case MOUSE.wheel:
            break;
    }
}

function onMouseMove(e: any) {
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

function onUpdate() {
    if (mouseMode === 'inertia') {
        moveCameraWithSpeed();
        decreaseCameraSpeed();
        if (CameraStore.speed === null) {
            mouseMode = 'idle';
        }
    }
    collisions = [];
    for (let i = 0; i < bodies.length; i += 1) {
        body = bodies[i];
        actual.x = body.state.x;
        actual.y = body.state.y;
        sign.y = body.velocity.y === 0 ? 0 : (body.velocity.y > 0 ? 1 : -1);

        if (body.force || body.velocity.y !== 0) {
            staticBody = getStatic(actual.x, actual.y + sign.y);
            if (staticBody === undefined) {
                if (body.force) {
                    body.velocity.y += body.force.y;
                }
                if (body.bounceLine) {
                    body.velocity.y += (body.bounceLine - body.y) / 100 - sign.y * HEAT_ENERGY;
                }
            } else {
                collisions.push({
                    staticBody,
                    velocity: LOOSING_COEF * body.velocity.y * body.mass / staticBody.mass
                });
                body.velocity.y = 0;
            }
        }

        if (body.parent) {
            dx = body.parent.x - body.x;
            dy = body.parent.y - body.y;
            dLength = Math.sqrt(dx * dx + dy * dy);
            gapLength = (dLength - body.distanceToParent) / dLength;
            body.velocity.x += dx * gapLength;
            body.velocity.y += dy * gapLength;
        }

        if (body.velocity.x > MAX_SPEED) {
            body.velocity.x = MAX_SPEED;
        }
        if (body.velocity.y > MAX_SPEED) {
            body.velocity.y = MAX_SPEED;
        }
        body.x += body.velocity.x;
        body.y += body.velocity.y;

        if (Math.abs(actual.x - body.x) > MAX_SPEED) {
            body.updateX(sign.x);
        }
        if (Math.abs(actual.y - body.y) > MAX_SPEED) {
            delStatic(actual.x, actual.y);
            body.updateY(sign.y);
            setStatic(actual.x, actual.y + sign.y, body);
        }
    }

    for (let i = 0; i < collisions.length; i += 1) {
        collision = collisions[i];
        collision.staticBody.velocity.y = collision.velocity;
        wave(collision.staticBody);
    }
}

const actual: Position = { x: 0, y: 0 };
const sign: Position = { x: 0, y: 0 };
let body: IBodyStore;
let dx = 0;
let dy = 0;
let gapLength = 0;
let dLength = 0;
let staticBody: IBodyStore | undefined;
let collisions: { staticBody: IBodyStore, velocity: number }[] = [];
let collision: { staticBody: IBodyStore, velocity: number };

function wave(body: IBodyStore) {
    if (!body.connections || body.velocity.y === 0) {
        return;
    }
    for (let i = 0; i < body.connections.length; i += 1) {
        body.connections[i].velocity.y = body.velocity.y * LOOSING_COEF;
        wave(body.connections[i]);
    }
}
