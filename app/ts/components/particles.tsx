import * as React from 'react';
import { Vector3 } from 'three';
import { Parametric } from './parametric';


const PARTICLES_IN_COLUMN = 1;// all
const PARTICLES_IN_ROW = 240;// count in the row
const PARTICLES_WIDTH = 5;// units
const count = PARTICLES_IN_COLUMN * PARTICLES_IN_ROW;

export const particles: { [key: string]: number } = {};
for (let i = 0; i < count; i += 1) {
    particles[
        `${Math.floor(i % PARTICLES_IN_ROW) - 120}|${Math.floor(i / PARTICLES_IN_ROW) - 60}`
    ] = i;
}

export function Particles() {
    return (
        <Parametric
            position={new Vector3(-120 * PARTICLES_WIDTH, -60 * PARTICLES_WIDTH, 0)}
            slices={1}
            stacks={1}
            parametricFunction={(u, v) => new Vector3(
                u * PARTICLES_IN_ROW * PARTICLES_WIDTH,
                v * PARTICLES_WIDTH,
                0
            )}
        />
    );
}


interface Props {
    x: number;
    y: number;
}

export function Particle(props: Props) {
    return (
        <Parametric
            position={new Vector3(props.x * PARTICLES_WIDTH, props.y * PARTICLES_WIDTH, 0)}
            slices={1}
            stacks={1}
            parametricFunction={(u, v) => pointInTheQuad(u, v, PARTICLES_WIDTH)}
        />
    );
}

function pointInTheQuad(u: number, v: number, length: number): Vector3 {
    return new Vector3(
        u * length,
        v * length,
        0
    );
}
