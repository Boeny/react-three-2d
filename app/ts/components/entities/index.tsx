import * as React from 'react';
import { Vector3, DataTexture, RGBFormat } from 'three';
import { observable, runInAction, toJS } from 'mobx';
import { observer } from 'mobx-react';
import {
    getNewData, getNewValueAtCoo, getKey, getSizeFromData, showDataAndStack
} from './utils';
import { Store as movable } from '../movable/store';
import { Store as events } from '../events/store';
import { Data, IStore } from './types';
import { MountAndInit } from '../mount-and-init';
import { Quad } from '../quad';
import { savedData } from '~/saves';
import { WIDTH_SCALE } from '~/constants';
import { INITIAL_VALUE } from './constants';


interface Color {
    r: number;
    g: number;
    b: number;
}

const YELLOW_COLOR: Color = { r: 255, g: 223, b: 0 };

export const Store: IStore = {
    state: observable(savedData.state),
    init() {
        this.setDataAndSize(this.state.data);
    },
    setDataAndSize(data: Data) {
        runInAction(() => {
            this.state.data = data;
            this.state.size = getSizeFromData(data);
        });
    },
    nextStep() {
        runInAction(() => {
            if (this.state.mode > 0) {
                const result = getNewValueAtCoo(toJS(this.state.data));
                this.state.currentCoo = result.coo;
                this.setDataAndSize(result.data);
            } else {
                this.setDataAndSize(getNewData(toJS(this.state.data)));
            }
        });
    },
    setMode(mode: number) {
        runInAction(() => this.state.mode = mode);
    },
    nextMode() {
        console.log(this.state.mode + 1);
        this.setMode(this.state.mode + 1);
    },
    toggleNegative() {
        console.log(!this.state.showNegative);
        runInAction(() => this.state.showNegative = !this.state.showNegative);
    },
    save() {
        console.log('saving...');
        showDataAndStack(this.state);
    }
};


const position = new Vector3();

const ConnectedEntities = observer(() => {
    const { width, height } = Store.state.size;
    return (
        <Quad
            position={position}
            width={WIDTH_SCALE * width}
            height={WIDTH_SCALE * height}
            texture={getTextureData(width, height, Store.state)}
        />
    );
});

function getTextureData(
    width: number, height: number, { data, currentCoo, showNegative }: IStore['state']
): DataTexture {
    const size = width * height;
    const texData = new Uint8Array(3 * size);
    const width2 = Math.floor(width / 2);
    const height2 = height / 2;
    for (let i = 0; i < size; i += 1) {
        const coo = getKey({ x: i % width - width2, y: Math.floor(i / width - height2) });
        const color = currentCoo === coo ? YELLOW_COLOR : getColor(data[coo] || 0, showNegative);
        const stride = i * 3;
        texData[stride] = color.r;
        texData[stride + 1] = color.g;
        texData[stride + 2] = color.b;
    }
    const texture = new DataTexture(texData, width, height, RGBFormat);
    texture.needsUpdate = true;
    return texture;
}

function getColor(color: number, showNegative: boolean): Color {
    const c = Math.round(color * 255 / INITIAL_VALUE);
    return c >= 0 ? { r: c, g: c, b: c } : { r: showNegative ? -c : 0, g: 0, b: 0 };
}


export function Entities(_: PositionProps) {
    return (
        <MountAndInit
            component={<ConnectedEntities />}
            onMount={() => {
                movable.add({ onEveryTick });
                Store.init();
            }}
        />
    );
}

function onEveryTick() {
    if (events.state.stepMode === false) {
        Store.nextStep();
    }
}
