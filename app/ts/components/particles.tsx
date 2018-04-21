import * as React from 'react';
import { Vector3 } from 'three';
import { Parametric } from './parametric';


const PARTICLES_IN_COLUMN = 1;// all
const PARTICLES_IN_ROW = 500;// count in the row
const PARTICLES_WIDTH = 5;// units
const count = PARTICLES_IN_COLUMN * PARTICLES_IN_ROW;

export const particles: { [key: string]: number } = {};
for (let i = 0; i < count; i += 1) {
    particles[
        `${Math.floor(i % PARTICLES_IN_ROW) - 250}|${Math.floor(i / PARTICLES_IN_ROW) - 60}`
    ] = i;
}

export function Particles() {
    return (
        <group position={new Vector3(-250 * PARTICLES_WIDTH, -80 * PARTICLES_WIDTH, 0)}>
            {Object.keys(particles).map((coo, i) => (
                <Particle
                    key={i}
                    x={parseInt(coo.split('|')[0], 10) + 250}
                    y={parseInt(coo.split('|')[1], 10) + 80}
                />
            ))}
        </group>
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
