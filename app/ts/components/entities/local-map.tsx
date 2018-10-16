import * as React from 'react';
import { Vector3, DataTexture, RGBFormat } from 'three';
import { observer } from 'mobx-react';
import { Store } from './store';
import { getKey, getPosition, getColor } from './utils';
import { Quad } from '../quad';
import { WIDTH_SCALE } from '~/constants';
import { INITIAL_VALUE } from './constants';


export const LocalMap = observer(() => {
    const { x, y } = getPosition(Store.state.currentCoo);
    const count = Store.getCurrentValue();
    const width = Math.floor(Math.sqrt(INITIAL_VALUE)) + 1;
    return (
        <group>
        <Quad
            position={new Vector3(x, y, 0)}
            width={WIDTH_SCALE}
            height={WIDTH_SCALE}
        />
        </group>
    );
});

function getTextureData(width: number, height: number, count: number): DataTexture {
    const size = width * height;
    const texData = new Uint8Array(3 * size);
    const width2 = Math.floor(width / 2);
    const height2 = height / 2;
    for (let i = 0; i < size; i += 1) {
        const coo = getKey({
            x: i % width - width2,
            y: Math.floor(i / width - height2)
        });
        const color = getColor(count, false);
        const stride = i * 3;
        texData[stride] = color.r;
        texData[stride + 1] = color.g;
        texData[stride + 2] = color.b;
    }
    const texture = new DataTexture(texData, width, height, RGBFormat);
    texture.needsUpdate = true;
    return texture;
}
