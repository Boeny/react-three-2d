import * as React from 'react';
import { Vector3, DataTexture, RGBFormat, Euler } from 'three';
import { Quad } from '../quad';
import { BASEMENT_LENGTH, STEPS_IN_SINGLE_TRACK, STEPS_IN_WHOLE_TRACK_COUNT } from './constants';


const TRACK_WIDTH = 0.5;
const TRACK_COLOR = { r: 5, g: 5, b: 5 };
const GAP_COLOR = { r: 200, g: 200, b: 200 };


interface BaseProps {
    position: Vector3;
    rotation: Euler;
    offset: number;
}

export class Track extends React.Component<BaseProps> {

    texture: DataTexture = getDefaultData();

    render() {
        const { offset, position, rotation } = this.props;
        this.texture.needsUpdate = true;
        this.texture.offset.x = offset / STEPS_IN_WHOLE_TRACK_COUNT;
        return (
            <Quad
                width={BASEMENT_LENGTH}
                height={TRACK_WIDTH}
                position={position}
                texture={this.texture}
                rotation={rotation}
            />
        );
    }
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
