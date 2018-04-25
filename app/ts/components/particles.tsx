import * as React from 'react';
import { Vector3 } from 'three';
import { Parametric } from './parametric';
import { Body } from './body';


const PARTICLES_IN_COLUMN = 1;// all
const PARTICLES_IN_ROW = 240;// count in the row
const offset = { x: -PARTICLES_IN_ROW / 2, y: -60 };
const count = PARTICLES_IN_COLUMN * PARTICLES_IN_ROW;

export function Particles() {
    return (
        <group>
            {Array.from(new Array(count)).map((item, i) => (
                <Body
                    mass={10}
                    position={new Vector3(i + offset.x, offset.y, 0)}
                />// connected to each other
            ))}
        </group>
    );
}


const PARTICLES_WIDTH = 5;// units

interface Props {
    x: number;
    y: number;
    color?: string;
}

export function Particle(props: Props) {
    return (
        <Parametric
            position={new Vector3(props.x * PARTICLES_WIDTH, props.y * PARTICLES_WIDTH, 0)}
            slices={1}
            stacks={1}
            parametricFunction={(u, v) => pointInTheQuad(u, v, PARTICLES_WIDTH)}
            color={props.color}
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
