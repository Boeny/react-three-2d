import * as React from 'react';
import { Vector3, DataTexture, RGBFormat } from 'three';
import { Quad } from './quad';

const SIZE = 1024 * 1024;
const POSITION = new Vector3();
const MAP_TEX = getTextureData(new Uint8Array(3 * SIZE));

export const Map = () => {
    return (
        <Quad
            position={POSITION}
            width={100}
            height={100}
            texture={MAP_TEX}
        />
    );
};

function getTextureData(data: Uint32Array): DataTexture {
    for (let i = 0; i < SIZE; i += 1) {
        const stride = i * 3;
        data[stride] = Math.round(Math.random() * 20);
        data[stride + 1] = Math.round(Math.random() * 150 + 50);
        data[stride + 2] = Math.round(Math.random() * 50);
    }
    const texture = new DataTexture(data, 1024, 1024, RGBFormat);
    texture.needsUpdate = true;
    return texture;
}
