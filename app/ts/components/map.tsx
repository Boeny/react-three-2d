import * as React from 'react';
import { Vector3, DataTexture, RGBFormat } from 'three';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
// import { Position } from '~/types';
import { Quad } from './quad';
import { STEPS_IN_UNIT } from './tank/constants';


const WIDTH = 10;
const STEPS = WIDTH * STEPS_IN_UNIT;
const TEX_SIZE = STEPS * STEPS;
const POSITION = new Vector3();

const TRAIL_COLOR = { r: 56, g: 30, b: 8 };

/*
function getGrassColor() {
    return {
        r: Math.random() * 20,
        g: Math.random() * 150 + 50,
        b: Math.random() * 50
    };
}
*/

function getDirtColor() {
    const deltaGreen = 10;
    return {
        r: TRAIL_COLOR.r / 2,
        g: Math.random() * deltaGreen * 2 + TRAIL_COLOR.g / 2 - deltaGreen,
        b: TRAIL_COLOR.b
    };
}

const Store = observable({
    data: getDefaultData()
});

function getDefaultData(): Uint8Array {
    const data = new Uint8Array(3 * TEX_SIZE);
    for (let i = 0; i < TEX_SIZE; i += 1) {
        const stride = i * 3;
        const color = getDirtColor();
        data[stride] = color.r;
        data[stride + 1] = color.g;
        data[stride + 2] = color.b;
    }
    return data;
}


export const Map = observer(() => {
    return (
        <Quad
            name={'map'}
            position={POSITION}
            width={100}
            height={100}
            texture={getTextureData(Store.data)}
        />
    );
});

function getTextureData(data: Uint32Array): DataTexture {
    const texture = new DataTexture(data, STEPS, STEPS, RGBFormat);
    texture.needsUpdate = true;
    return texture;
}
/*
export const updateMap = action((data: Position[]) => { // positions in units
    data.map(position => {
        const stride = (position.y * STEPS + position.x) * 3 * STEPS_IN_UNIT;
        Store.data[stride] = color.r;
        Store.data[stride + 1] = color.g;
        Store.data[stride + 2] = color.b;
    });
});
*/
