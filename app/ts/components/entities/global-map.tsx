import * as React from 'react';
import { Vector3, DataTexture, RGBFormat } from 'three';
import { observer } from 'mobx-react';
import { Store } from './store';
import { getKey, isInStack, getColor, getSizeFromData } from './utils';
import { IStore } from './types';
import { Quad } from '../quad';
import { YELLOW_COLOR } from './constants';


const BLACK_COLOR = { r: 0, g: 0, b: 0 };
const POSITION = new Vector3();
const BLUE_BORDER = 1;

export const GlobalMap = observer(() => {
    const { width, height } = getSizeFromData(Store.state.data);

    return (
        <Quad
            position={POSITION}
            width={width}
            height={height}
            texture={getTextureData(width, height, Store.state)}
        />
    );
});

function getBlue(count?: number) {
    const c = count === undefined ? 0 : (
        count >= 0 ? BLUE_BORDER - count : BLUE_BORDER + count
    );
    return { r: 0, g: 0, b: 255 * c / BLUE_BORDER };
}

function getTextureData(
    width: number, height: number, { data, local, currentCoo, showNegative, mode, showStack }: IStore['state']
): DataTexture {
    const size = width * height;
    const texData = new Uint8Array(3 * size);
    const width2 = Math.floor(width / 2);
    const height2 = height / 2;
    const localCoos = Object.keys(local);
    for (let i = 0; i < size; i += 1) {
        const coo = getKey({
            x: i % width - width2,
            y: Math.floor(i / width - height2)
        });
        const count = data[coo] || 0;
        let color = showStack && isInStack(coo) ?
            YELLOW_COLOR : (
                showNegative === false && count < 0 ? BLACK_COLOR : (
                    count > 0 && count < BLUE_BORDER ? getBlue(data[coo]) : getColor(count)
                )
            );
        switch (mode) {
            case 1:
                if (coo === currentCoo && data[currentCoo] !== undefined) {
                    color = YELLOW_COLOR;
                }
                break;
            case 2:
                if (localCoos.indexOf(coo) > -1 && (count < 0 || count >= BLUE_BORDER)) {
                    color = BLACK_COLOR;
                }
                break;
        }
        const stride = i * 3;
        texData[stride] = color.r;
        texData[stride + 1] = color.g;
        texData[stride + 2] = color.b;
    }
    const texture = new DataTexture(texData, width, height, RGBFormat);
    texture.needsUpdate = true;
    return texture;
}
