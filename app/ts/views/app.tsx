import * as React from 'react';
import * as events from '~/utils/events';
import * as React3 from 'react3';
import * as constants from '~/constants';
import { Store as html } from './html/store';
import { Vector2 } from 'three';
import { Player, Events, Movable, Colliders, Enemies, Constants } from '~/components';
import { Html } from './html';


export function App() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return (
        <React.Fragment>
            <Html />
            <React3
                mainCamera={'camera'}
                width={width}
                height={height}
                canvasRef={html.setCanvas}
                {...events}
            >
                <scene>
                    <Player position={new Vector2()} />
                    <Enemies />
                    <Events position={new Vector2(-20, 10)} />
                    <Movable position={new Vector2(-40, -20)} />
                    <Colliders position={new Vector2(40, -20)} />
                    <Constants
                        position={new Vector2(0, -20)}
                        data={constants}
                    />
                </scene>
            </React3>
        </React.Fragment>
    );
}
