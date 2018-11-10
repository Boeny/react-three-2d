import * as React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Quad } from './quad';
import { EMPTY_VECTOR3 } from '~/constants';


const MAP_WIDTH = 50;
const TEX_SIZE = MAP_WIDTH * MAP_WIDTH;


function getDirtColor() {
    return {
        r: 0,
        g: 0,
        b: 0
    };
}

export const Store = observable({
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
            position={EMPTY_VECTOR3}
            width={MAP_WIDTH}
            height={MAP_WIDTH}
            color={'#cccccc'}
        />
    );
});
/*
function getTextureData(data: Uint32Array): DataTexture {
    const texture = new DataTexture(data, STEPS, STEPS, RGBFormat);
    texture.needsUpdate = true;
    return texture;
}
*/
