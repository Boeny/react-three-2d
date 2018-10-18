import * as React from 'react';
import * as events from '~/utils/events';
import * as React3 from 'react3';
import { Vector3 } from 'three';
import { Store as html } from './html/store';
import { Entities, Player } from '~/components';
import { Html } from './html';
import { savedData } from '~/saves';


export function App() {
    const { camera } = savedData;
    return (
        <React.Fragment>
            <Html />
            <React3
                mainCamera={'camera'}
                width={window.innerWidth}
                height={window.innerHeight}
                canvasRef={(el: HTMLCanvasElement | null) => html.setCanvas(el)}
                {...events}
            >
                <scene>
                    <directionalLight
                        color={'#ffffff'}
                        intensity={1}
                        position={new Vector3()}
                        lookAt={new Vector3(1, -1, -1)}
                    />
                    <ambientLight
                        color={'#ffffff'}
                        intensity={0.5}
                    />
                    <Player {...camera} />
                    <Entities />
                </scene>
            </React3>
        </React.Fragment>
    );
}
