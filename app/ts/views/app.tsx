import * as React from 'react';
import * as events from '~/utils/events';
import * as React3 from 'react3';
import { Store as html } from './html/store';
import { Vector2 } from 'three';
import { Entities, Player } from '~/components';
import { Html } from './html';
import { Audio, AudioSource } from '~/components/audio';


export function App() {
    return (
        <React.Fragment>
            <Html />
            <Audio />
            <AudioSource />
            <React3
                mainCamera={'camera'}
                width={window.innerWidth}
                height={window.innerHeight}
                canvasRef={(el: HTMLCanvasElement | null) => html.setCanvas(el)}
                {...events}
            >
                <scene>
                    <Player position={new Vector2()} color={'#330000'} />
                    <Entities position={new Vector2()} />
                </scene>
            </React3>
        </React.Fragment>
    );
}
