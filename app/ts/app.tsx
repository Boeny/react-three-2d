import * as React from 'react';
import { eventsStore } from '~/utils/events';
import * as React3 from 'react3';
import * as constants from '~/constants';
import { Store as html } from './views/html/store';
import { Vector2 } from 'three';
import { Player, Events, Movable, Colliders, Enemies, Constants } from '~/components';
import { Html } from './views/html';


export function App() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const { onAnimate, onKeyDown, onKeyUp, onMouseDown, onMouseMove, onMouseUp, onWheel } = eventsStore;
    const e = { onAnimate, onKeyDown, onKeyUp, onMouseDown, onMouseMove, onMouseUp, onWheel };
    return (
        <React.Fragment>
            <Html />
            <React3
                mainCamera={'camera'}
                width={width}
                height={height}
                canvasRef={(el: HTMLCanvasElement | null) => html.setCanvas(el)}
                {...e}
            >
                <scene>
                    <Player position={new Vector2()} />
                    <Enemies />
                    <Events position={new Vector2(-20, 10)} />
                    <Movable position={new Vector2(-40, -20)} />
                    <Colliders />
                    <Constants
                        position={new Vector2(0, -20)}
                        data={constants}
                    />
                </scene>
            </React3>
        </React.Fragment>
    );
}
