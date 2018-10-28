import * as React from 'react';
import { Vector3, Euler, DataTexture, RGBFormat } from 'three';
import { Position } from '~/types';
import { Cube } from './cube';
import { Quad } from './quad';


const BASEMENT_WIDTH = 3;
export const TRACK_LENGTH = 24;
const TRACK_STEPS_COUNT = 512;
export const STEPS_IN_UNIT = TRACK_STEPS_COUNT / BASEMENT_WIDTH;

interface Props {
    position: Position;
    rotation: number;
    offset?: number;
}

export function Tank(props: Props) {
    return (
        <group>
            <Basement {...props} />
            <Tower {...props} />
        </group>
    );
}


function Basement(props: Props) {
    const { position, rotation, offset } = props;
    return (
        <group
            position={new Vector3(position.x, position.y, 0)}
            rotation={new Euler(0, 0, rotation)}
        >
            <Cube
                position={new Vector3()}
                width={BASEMENT_WIDTH}
                height={2}
                depth={0.75}
                color={'#dddddd'}
            />
            <Quad
                width={3}
                height={0.5}
                position={new Vector3(0, 0.75, 0.5)}
                texture={getTextureData(TRACK_STEPS_COUNT, 1, offset || 0)}
            />
            <Quad
                width={3}
                height={0.5}
                position={new Vector3(0, -0.75, 0.5)}
                texture={getTextureData(TRACK_STEPS_COUNT, 1, offset || 0)}
            />
        </group>
    );
}

const TRACK_COLOR = { r: 5, g: 5, b: 5 };
const GAP_COLOR = { r: 200, g: 200, b: 200 };

function getTextureData(width: number, height: number, offset: number): DataTexture {
    const size = width * height;
    const texData = new Uint8Array(3 * size);
    for (let i = 0; i < size; i += 1) {
        const color = (i % width) % TRACK_LENGTH === offset ? GAP_COLOR : TRACK_COLOR;
        const stride = i * 3;
        texData[stride] = color.r;
        texData[stride + 1] = color.g;
        texData[stride + 2] = color.b;
    }
    const texture = new DataTexture(texData, width, height, RGBFormat);
    texture.needsUpdate = true;
    return texture;
}


function Tower(props: Props) {
    const { position, rotation } = props;
    return (
        <group
            position={new Vector3(position.x, position.y, 0.75)}
            rotation={new Euler(0, 0, rotation)}
        >
            <Cube
                position={new Vector3()}
                rotation={{ x: 0, y: 0, z: 0 }}
                width={1}
                height={0.9}
                depth={0.5}
                color={'#cccccc'}
            />
            <Cube
                position={new Vector3(1, 0, 0.0625)}
                rotation={{ x: 0, y: 0, z: 0 }}
                width={2}
                height={0.25}
                depth={0.25}
                color={'#aaaaaa'}
            />
        </group>
    );
}
