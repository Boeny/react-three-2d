import * as React from 'react';
import * as React3 from 'react3';
import * as events from '~/utils/events';
import { Vector2 } from 'three';
import { setCanvas } from './html/actions';
import { Camera, Ground, Player } from '~/components';


export function App() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return (
        <React.Fragment>
            <React3
                mainCamera={'camera'}
                width={width}
                height={height}
                canvasRef={setCanvas}
                {...events}
            >
                <scene>
                    <Camera />
                    <Player />
                    <Ground position={new Vector2(0, -1)} />
                </scene>
            </React3>
        </React.Fragment>
    );
}
