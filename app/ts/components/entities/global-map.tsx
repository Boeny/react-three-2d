import * as React from 'react';
import { Vector3, DataTexture, RGBFormat } from 'three';
import { observer } from 'mobx-react';
import { Store } from './store';
import { getKey, getColor } from './utils';
import { IStore, Color } from './types';
import { Quad } from '../quad';
import { WIDTH_SCALE } from '~/constants';


const YELLOW_COLOR: Color = { r: 255, g: 223, b: 0 };
const BLACK_COLOR: Color = { r: 0, g: 0, b: 0 };
const POSITION = new Vector3();

export const GlobalMap = observer(() => {
    const { width, height } = Store.state.size;
    return (
        <Quad
            position={POSITION}
            width={WIDTH_SCALE * width}
            height={WIDTH_SCALE * height}
            texture={getTextureData(width, height, Store.state)}
        />
    );
});

function getTextureData(
    width: number, height: number, { data, currentCoo, showNegative, mode }: IStore['state']
): DataTexture {
    const size = width * height;
    const texData = new Uint8Array(3 * size);
    const width2 = Math.floor(width / 2);
    const height2 = height / 2;
    for (let i = 0; i < size; i += 1) {
        const coo = getKey({
            x: i % width - width2,
            y: Math.floor(i / width - height2)
        });
        const color = currentCoo === coo ?
            (mode === 1 ? YELLOW_COLOR : BLACK_COLOR) :
            getColor(data[coo] || 0, showNegative);
        const stride = i * 3;
        texData[stride] = color.r;
        texData[stride + 1] = color.g;
        texData[stride + 2] = color.b;
    }
    const texture = new DataTexture(texData, width, height, RGBFormat);
    texture.needsUpdate = true;
    return texture;
}
