import * as React from 'react';
import { Vector3 } from 'three';
import { Parametric } from './parametric';


const WIDTH_MULTIPLIER = 5;// units

interface Props {
    x: number;
    y: number;
    color?: string;
}

export function Particle(props: Props) {
    return (
        <Parametric
            position={new Vector3(props.x * WIDTH_MULTIPLIER, props.y * WIDTH_MULTIPLIER, 0)}
            slices={1}
            stacks={1}
            parametricFunction={(u, v) => pointInTheQuad(u, v, WIDTH_MULTIPLIER)}
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