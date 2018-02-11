import * as React from 'react';
import * as React3 from 'react3';
import { Store as HtmlStore } from './html/store';

import { setColor } from './planet/actions';
import { Planet } from './planet';

import { setZoom } from './camera/actions';
import { Camera } from './camera';


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
            onWheel={(e: any) => setZoom(e.deltaY)}
        >
            <scene>
                <Camera />
                <Planet />
            </scene>
        </React3>
    );
}
