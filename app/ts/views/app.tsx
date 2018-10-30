import * as React from 'react';
import * as events from '~/utils/events';
import * as React3 from 'react3';
import { Vector3, BasicShadowMap } from 'three';
import { Store as html } from '~/views/html/store';
import { Map, Player, Enemies, AudioSource } from '~/components';
import { Html } from '~/views/html';
import { savedData } from '~/saves';


export function App() {
    const { camera } = savedData;
    const { windowWidth, windowHeight } = html.state;
    return (
        <React.Fragment>
            <Html />
            <React3
                shadowMapEnabled={false}
                shadowMapType={BasicShadowMap}
                mainCamera={'camera'}
                width={windowWidth}
                height={windowHeight}
                canvasRef={(el: HTMLCanvasElement | null) => html.setCanvas(el)}
                {...events}
            >
                <scene>
                    <AudioSource />
                    <directionalLight
                        color={'#ffffff'}
                        intensity={1}
                        position={new Vector3(0, 0, 10)}
                        lookAt={new Vector3(10, -10, 5)}
                        castShadow={true}
                    />
                    <ambientLight
                        color={'#ffffff'}
                        intensity={0.5}
                    />
                    <Player {...camera} />
                    <Enemies />
                    <Map />
                </scene>
            </React3>
        </React.Fragment>
    );
}
