import * as React from 'react';
import * as React3 from 'react3';
import { Vector3 } from 'three';
import { setColor } from '~/views/planet/actions';
import { Store as HtmlStore } from '~/views/html/store';
import { Planet } from '~/views/planet';


const cameraPosition = new Vector3(0, 0, 5);

export function Scene() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return (
        <React3
            mainCamera={'camera'} // this points to the perspectiveCamera which has the name set to "camera" below
            width={width}
            height={height}
            onAnimate={() => {
                setColor(HtmlStore.DOM && HtmlStore.DOM.style.backgroundColor || 'white');
            }}
        >
            <scene>
                <orthographicCamera
                    name={'camera'}
                    left={- width / 2}
                    right={width / 2}
                    top={height / 2}
                    bottom={- height / 2}
                    near={0.1}
                    far={1000}
                    position={cameraPosition}
                    zoom={1}
                />
                <Planet />
            </scene>
        </React3>
    );
}
/*
<perspectiveCamera
    name={'camera'}
    fov={75}
    aspect={width / height}
    near={0.1}
    far={1000}
    position={cameraPosition}
/>
*/
