import * as React from 'react';
import { Vector3, Euler, DataTexture, RGBFormat } from 'three';
import { Position } from '~/types';
import { Cube } from './cube';
import { Quad } from './quad';
import { Bullets } from './bullet';


const BASEMENT_LENGTH = 3;
const BASEMENT_DEPTH = 0.75;
const TRACK_WIDTH = 0.5;
export const STEPS_IN_SINGLE_TRACK = 24;
const STEPS_IN_WHOLE_TRACK_COUNT = 256;
export const STEPS_IN_UNIT = STEPS_IN_WHOLE_TRACK_COUNT / BASEMENT_LENGTH;
// const UNITS_IN_STEP = 1 / STEPS_IN_UNIT;
export const TRACK_DISTANCE = 0.75;
const POSITION = new Vector3();

const TRACK_COLOR = { r: 5, g: 5, b: 5 };
const GAP_COLOR = { r: 200, g: 200, b: 200 };

const LEFT_TRACK_TEX = getDefaultData();
const RIGHT_TRACK_TEX = getDefaultData();

const BARREL_OFFSET = new Vector3(1, 0, 0.0625);
const BARREL_LENGTH = 2;


interface Props extends TowerProps {
    trackOffsetLeft: number;
    trackOffsetRight: number;
    velocity: Vector3;
}

export function Tank(props: Props) {
    const { position, rotation, velocity } = props;
    const barrelPosition = rotateVectorBy(
        rotation,
        (new Vector3(position.x, position.y, BASEMENT_DEPTH)).add(BARREL_OFFSET)
    );
    barrelPosition.x += BARREL_LENGTH / 2;
    console.log(barrelPosition, position);
    return (
        <group>
            <Basement {...props} />
            <Tower {...props} />
            <Bullets
                position={barrelPosition}
                velocity={velocity}
                direction={rotateVectorBy(rotation, new Vector3(1, 0, 0))}
            />
        </group>
    );
}

function rotateVectorBy(ang: number, p: Vector3): Vector3 {
    p.x = p.x * Math.cos(ang);
    p.y = p.y * Math.sin(ang);
    return p;
}


function Basement(props: Props) {
    const { position, rotation, trackOffsetLeft, trackOffsetRight } = props;
    RIGHT_TRACK_TEX.needsUpdate = true;
    RIGHT_TRACK_TEX.offset.x = trackOffsetRight / STEPS_IN_WHOLE_TRACK_COUNT;
    LEFT_TRACK_TEX.needsUpdate = true;
    LEFT_TRACK_TEX.offset.x = trackOffsetLeft / STEPS_IN_WHOLE_TRACK_COUNT;
    return (
        <group
            position={new Vector3(position.x, position.y, 0)}
            rotation={new Euler(0, 0, rotation)}
        >
            <Cube
                position={POSITION}
                width={BASEMENT_LENGTH}
                height={2}
                depth={BASEMENT_DEPTH}
                color={'#dddddd'}
            />
            <Quad
                width={BASEMENT_LENGTH}
                height={TRACK_WIDTH}
                position={new Vector3(0, TRACK_DISTANCE, 0.5)}
                texture={RIGHT_TRACK_TEX}
            />
            <Quad
                width={BASEMENT_LENGTH}
                height={TRACK_WIDTH}
                position={new Vector3(0, -TRACK_DISTANCE, 0.5)}
                texture={LEFT_TRACK_TEX}
            />
        </group>
    );
}

function getDefaultData(): DataTexture {
    const data = new Uint8Array(3 * STEPS_IN_WHOLE_TRACK_COUNT);
    for (let i = 0; i < STEPS_IN_WHOLE_TRACK_COUNT; i += 1) {
        const x = i % STEPS_IN_WHOLE_TRACK_COUNT;
        const color = x % STEPS_IN_SINGLE_TRACK === 0 || (x + 1) % STEPS_IN_SINGLE_TRACK === 0
            || (x + 2) % STEPS_IN_SINGLE_TRACK === 0 ?
            GAP_COLOR : TRACK_COLOR;
        const stride = i * 3;
        data[stride] = color.r;
        data[stride + 1] = color.g;
        data[stride + 2] = color.b;
    }
    return new DataTexture(data, STEPS_IN_WHOLE_TRACK_COUNT, 1, RGBFormat);
}


interface TowerProps {
    position: Position;
    rotation: number;
}

function Tower(props: Props) {
    const { position, rotation } = props;
    return (
        <group
            position={new Vector3(position.x, position.y, BASEMENT_DEPTH)}
            rotation={new Euler(0, 0, rotation)}
        >
            <Cube
                position={POSITION}
                rotation={{ x: 0, y: 0, z: 0 }}
                width={1}
                height={0.9}
                depth={0.5}
                color={'#888888'}
            />
            <Cube // barrel
                position={BARREL_OFFSET}
                rotation={{ x: 0, y: 0, z: 0 }}
                width={BARREL_LENGTH}
                height={0.25}
                depth={0.25}
                color={'#777777'}
            />
            <Cube // hatch
                position={new Vector3(-0.16, 0.16, 0.25)}
                rotation={{ x: 0, y: 0, z: 0 }}
                width={0.375}
                height={0.375}
                depth={0.0625}
                color={'#555555'}
            />
        </group>
    );
}
