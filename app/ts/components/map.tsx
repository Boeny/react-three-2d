import * as React from 'react';
import { Vector3, DataTexture, RGBFormat } from 'three';
import { Quad } from './quad';


const POSITION = new Vector3();
const map = getTextureData(1024, 1024);

export const Map = () => {
    return (
        <Quad
            position={POSITION}
            width={100}
            height={100}
            texture={map}
        />
    );
};

function getTextureData(width: number, height: number): DataTexture {
    const size = width * height;
    const texData = new Uint8Array(3 * size);
    for (let i = 0; i < size; i += 1) {
        const stride = i * 3;
        texData[stride] = Math.round(Math.random() * 20);
        texData[stride + 1] = Math.round(Math.random() * 150 + 50);
        texData[stride + 2] = Math.round(Math.random() * 50);
    }
    const texture = new DataTexture(texData, width, height, RGBFormat);
    texture.needsUpdate = true;
    return texture;
}
