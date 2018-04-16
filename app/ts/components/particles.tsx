import * as React from 'react';
import { Vector3 } from 'three';
import { Parametric } from './parametric';


const PARTICLES_COUNT = 10;// all
const PARTICLES_IN_ROW = 10;// count in the row
const PARTICLES_WIDTH = 10;// units

export function Particles() {
    const particles: JSX.Element[] = [];
    for (let i = 0; i < PARTICLES_COUNT; i += 1) {
        particles.push(
            <Particle key={i} index={i} />
        );
    }
    return (
        <group>
            {particles}
        </group>
    );
}


interface Props {
    index: number;
}

function Particle(props: Props) {
    const y = Math.floor(props.index / PARTICLES_IN_ROW);
    const x = props.index * y;
    return (
        <Parametric
            position={new Vector3(x, y, 0)}
            slices={1}
            stacks={1}
            parametricFunction={(u, v) => pointInTheQuad(u, v, 10)}
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
