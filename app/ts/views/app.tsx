import * as React from 'react';
import * as React3 from 'react3';
import { Vector2, ShaderPass, EffectComposer, WebGLRenderer, RenderPass, Scene } from 'three';
import { Store as CameraStore } from '~/components/camera/store';
import { setCanvas, setCursor } from './html/actions';
import {
    setZoom as setCameraZoom, shiftPosition as moveCamera, moveBySpeed as moveCameraWithSpeed
} from '~/components/camera/actions';
import { getMouseVector } from '~/utils';
import {
    decreaseSpeed as decreaseCameraSpeed, setSpeed as setCameraSpeed
} from '~/components/camera/utils/store';
import { Camera, Ship } from '~/components';


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
            onUpdateRenderer={(renderer: WebGLRenderer) => composer = createComposer(renderer)}
        >
            <scene ref={(s: Scene) => scene = s}>
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
    if (composer !== null) {
        composer.render();
    }
}

let composer: EffectComposer | null = null;
let scene: Scene | null = null;

function createComposer(renderer: WebGLRenderer): EffectComposer | null {
    if (scene === null || CameraStore.DOM === null) {
        console.warn(scene === null ? 'scene is null' : 'camera is null');
        return null;
    }
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, CameraStore.DOM);
    composer.addPass(renderPass);
    const customPass = new ShaderPass({
        uniforms: {
            tDiffuse: { value: null },
            amount: { value: 1.0 }
        },
        vertexShader: [
            'varying vec2 xy;',
            'void main() {',
            'xy = uv;',
            'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            '}'
        ].join('\n'),
        fragmentShader: [
            'uniform float amount;',
            'uniform sampler2D tDiffuse;',
            'varying vec2 xy;',
            'void main() {',
            'float radius = distance(xy, vec2(0.5, 0.5));',
            'vec4 color = texture2D( tDiffuse, xy );',
            'float c = 0.2 / radius;',
            'gl_FragColor = vec4(c, c, c, 1.0);',
            '}'
        ].join('\n')
    });
    customPass.renderToScreen = true;
    composer.addPass(customPass);
    return composer;
}
