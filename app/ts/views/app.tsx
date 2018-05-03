import * as React from 'react';
import * as React3 from 'react3';
import { Vector2, Vector3 } from 'three';
import { Store as CameraStore } from '~/components/camera/store';
import { setCanvas, setCursor } from './html/actions';
import {
    setZoom as setCameraZoom, shiftPosition as moveCamera, moveBySpeed as moveCameraWithSpeed
} from '~/components/camera/actions';
import { getMouseVector, clamp } from '~/utils';
import {
    decreaseSpeed as decreaseCameraSpeed, setSpeed as setCameraSpeed, toWorldPoint
} from '~/components/camera/utils/store';
import { Camera, Ground, AudioComponent, Stick } from '~/components';
import {
    Bodies as bodies, IStore as IBodyStore, getStatic, delStatic, setStatic// , Position
} from '~/components/body';
import { Player, Store as player } from '~/components/player';
import { MAX_SPEED, MIN_SPEED } from '~/constants';


let mouseMode: 'idle' | 'drag' | 'inertia' | 'target' = 'idle';
let dragStartPoint: Vector2 | null = null;
let timer = 0;
const MOUSE = {
    left: 0,
    wheel: 1,
    right: 2
};
const KEY = {
    SPACE: ' ',
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight'
};
const TIMER_DELAY = 1;
const HEAT_ENERGY = 0.00001;
const LOOSING_COEF = 1 - HEAT_ENERGY;


export function App() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return (
        <React.Fragment>
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
                onKeyDown={onKeyDown}
            >
                <scene>
                    <Camera position={new Vector3(0, 300, 0)} />
                    <Player />
                    <Stick
                        length={10}
                        getPosition={i => new Vector3(-10, i + 1, 0)}
                    />
                    <Ground />
                </scene>
            </React3>
        </React.Fragment>
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
            bodies[0].target = toWorldPoint(getMouseVector(e));
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

function onKeyDown(e: any) {
    switch (e.key) {
        case KEY.LEFT:
            player.moveLeft();
            break;
        case KEY.RIGHT:
            player.moveRight();
            break;
        case KEY.UP:
            player.jump();
            break;
        case KEY.DOWN:
            player.sit();
            break;
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
    // collisions = [];
    for (let i = 0; i < bodies.length; i += 1) {
        const body = bodies[i];
        const actual = {
            x: body.state.x,
            y: body.state.y
        };
        const signVector = {
            x: handleCollision(body, 'x'),
            y: handleCollision(body, 'y')
        };
        if (body.parent) {
            const dx = body.parent.x - body.x;
            const dy = body.parent.y - body.y;
            const dLength = Math.sqrt(dx * dx + dy * dy);
            const gapLength = dLength - body.distanceToParent;
            body.velocity.x += gapLength * dx / dLength;
            body.velocity.y += gapLength * dy / dLength;
            signVector.x = getSign(body.velocity.x);
            signVector.y = getSign(body.velocity.y);
        }
        /*if (body.target) {
            dx = body.target.x - body.x;
            dy = body.target.y - body.y;
            dLength = Math.sqrt(dx * dx + dy * dy);
            if (dLength < 1) {
                body.target = undefined;
            } else {
                body.velocity.x += 1 * dx / dLength;
                body.velocity.y += 1 * dy / dLength;
            }
        }*/
        if (inRadius(body.velocity.x, MIN_SPEED)) {
            body.velocity.x = 0;
        }
        if (inRadius(body.velocity.y, MIN_SPEED)) {
            body.velocity.y = 0;
        }
        body.velocity.x = clamp(body.velocity.x, -MAX_SPEED, MAX_SPEED);
        body.velocity.y = clamp(body.velocity.y, -MAX_SPEED, MAX_SPEED);
        body.x += body.velocity.x;
        body.y += body.velocity.y;
        if (outOfBounds(actual.x - body.x, MAX_SPEED)) {
            delStatic(actual);
            body.updateX(signVector.x);
            actual.x += signVector.x;
            setStatic(actual, body);
        }
        if (outOfBounds(actual.y - body.y, MAX_SPEED)) {
            delStatic(actual);
            body.updateY(signVector.y);
            actual.y += signVector.y;
            setStatic(actual, body);
        }
    }
    /*for (let i = 0; i < collisions.length; i += 1) {
        collision = collisions[i];
        collision.staticBody.velocity = collision.velocity;
        wave(collision.staticBody);
    }*/
}

/*
interface Collision {
    staticBody: IBodyStore;
    velocity: Position;
}
let collision: Collision;
let collisions: Collision[] = [];


function wave(body: IBodyStore, parent?: IBodyStore) {
    if (!body.connections) {
        return;
    }
    if (outOfBounds(body.velocity.x, MIN_SPEED)) {
        for (let i = 0; i < body.connections.length; i += 1) {
            body.connections[i].velocity.x = body.velocity.x * LOOSING_COEF;
            if (body.connections[i] !== parent) {
                wave(body.connections[i], body);
            }
        }
        return;
    }
    if (outOfBounds(body.velocity.y, MIN_SPEED)) {
        for (let i = 0; i < body.connections.length; i += 1) {
            body.connections[i].velocity.y = body.velocity.y * LOOSING_COEF;
            if (body.connections[i] !== parent) {
                wave(body.connections[i], body);
            }
        }
    }
}
*/
function inRadius(n: number, distance: number): boolean {
    return n > -distance && n < distance;
}

function outOfBounds(n: number, bound: number): boolean {
    return n < -bound || n > bound;
}

function getSign(velocity: number): number {
    return velocity === 0 ? 0 : (velocity > 0 ? 1 : -1);
}

function handleCollision(bodyStore: IBodyStore, coo: 'x' | 'y'): number {
    const velocity = bodyStore.velocity[coo];
    const acceleration = bodyStore.force ? bodyStore.force[coo] : 0;
    if (velocity === 0 && acceleration === 0) {
        return getSign(velocity);
    }
    const sign = getSign(velocity + acceleration);
    const collider = coo === 'x' ?
        getStatic(bodyStore.state.x + sign, bodyStore.state.y) :
        getStatic(bodyStore.state.x, bodyStore.state.y + sign);
    if (collider === undefined) {
        bodyStore.velocity[coo] += acceleration;
        return sign;
    }
    if (outOfBounds(velocity, MIN_SPEED)) {
        AudioComponent(velocity);
    }
    let colliderVelocity = collider.velocity[coo];
    colliderVelocity = LOOSING_COEF * (
        velocity * bodyStore.mass + colliderVelocity * collider.mass
    ) / (bodyStore.mass + collider.mass);
    if (inRadius(colliderVelocity, MIN_SPEED)) {
        colliderVelocity = 0;
    }
    bodyStore.velocity[coo] = colliderVelocity;
    collider.velocity[coo] = colliderVelocity;
    return sign;
}
