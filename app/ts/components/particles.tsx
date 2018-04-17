import * as React from 'react';
import { Vector3 } from 'three';
import { Parametric } from './parametric';


const PARTICLES_IN_COLUMN = 1;// all
const PARTICLES_IN_ROW = 500;// count in the row
const PARTICLES_WIDTH = 5;// units
const count = PARTICLES_IN_COLUMN * PARTICLES_IN_ROW;

export function Particles() {
    const particles: JSX.Element[] = [];
    for (let i = 0; i < count; i += 1) {
        particles.push(
            <Particle key={i} index={i} />
        );
    }
    return (
        <group position={new Vector3(-250 * PARTICLES_WIDTH, -80 * PARTICLES_WIDTH, 0)}>
            {particles}
            <Body />
        </group>
    );
}


interface Props {
    index: number;
}

function Particle(props: Props) {
    const y = Math.floor(props.index / PARTICLES_IN_ROW);
    const x = props.index % PARTICLES_IN_ROW;
    return (
        <Parametric
            position={new Vector3(x * PARTICLES_WIDTH, y * PARTICLES_WIDTH, 0)}
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
