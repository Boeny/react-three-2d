import * as React from 'react';
import { Vector3, Euler, DataTexture, RGBFormat } from 'three';
import { Position } from '~/types';
import { Cube } from './cube';
import { Quad } from './quad';


const BASEMENT_LENGTH = 3;
const TRACK_WIDTH = 0.5;
export const STEPS_IN_SINGLE_TRACK = 24;
const STEPS_IN_WHOLE_TRACK_COUNT = 256;
export const STEPS_IN_UNIT = STEPS_IN_WHOLE_TRACK_COUNT / BASEMENT_LENGTH;
// const UNITS_IN_STEP = 1 / STEPS_IN_UNIT;
export const TRACK_DISTANCE = 0.75;
const POSITION = new Vector3();

const TRACK_COLOR = { r: 5, g: 5, b: 5 };
const GAP_COLOR = { r: 200, g: 200, b: 200 };

const LEFT_TRACK_TEX = new Uint8Array(3 * STEPS_IN_WHOLE_TRACK_COUNT);
const RIGHT_TRACK_TEX = new Uint8Array(3 * STEPS_IN_WHOLE_TRACK_COUNT);

interface Props extends TowerProps {
    trackOffsetLeft: number;
    trackOffsetRight: number;
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
    const { position, rotation, trackOffsetLeft, trackOffsetRight } = props;
    return (
        <group
            position={new Vector3(position.x, position.y, 0)}
            rotation={new Euler(0, 0, rotation)}
        >
            <Cube
                position={POSITION}
                width={BASEMENT_LENGTH}
                height={2}
                depth={0.75}
                color={'#dddddd'}
            />
            <Quad
                width={BASEMENT_LENGTH}
                height={TRACK_WIDTH}
                position={new Vector3(0, TRACK_DISTANCE, 0.5)}
                texture={getTextureData(RIGHT_TRACK_TEX, trackOffsetLeft || 0)}
            />
            <Quad
                width={BASEMENT_LENGTH}
                height={TRACK_WIDTH}
                position={new Vector3(0, -TRACK_DISTANCE, 0.5)}
                texture={getTextureData(LEFT_TRACK_TEX, trackOffsetRight || 0)}
            />
        </group>
    );
}

function getTextureData(data: Uint32Array, offset: number): DataTexture {
    for (let i = 0; i < STEPS_IN_WHOLE_TRACK_COUNT; i += 1) {
        const x = i % STEPS_IN_WHOLE_TRACK_COUNT;
        const color = x % STEPS_IN_SINGLE_TRACK === offset || (x + 1) % STEPS_IN_SINGLE_TRACK === offset
            || (x + 2) % STEPS_IN_SINGLE_TRACK === offset ?
                GAP_COLOR : TRACK_COLOR;
        const stride = i * 3;
        data[stride] = color.r;
        data[stride + 1] = color.g;
        data[stride + 2] = color.b;
    }
    const texture = new DataTexture(data, STEPS_IN_WHOLE_TRACK_COUNT, 1, RGBFormat);
    texture.needsUpdate = true;
    return texture;
}


interface TowerProps {
    position: Position;
    rotation: number;
}

function Tower(props: Props) {
    const { position, rotation } = props;
    return (
        <group
            position={new Vector3(position.x, position.y, 0.75)}
            rotation={new Euler(0, 0, rotation)}
        >
            <Cube
                position={POSITION}
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
