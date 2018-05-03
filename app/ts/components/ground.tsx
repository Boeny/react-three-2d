import * as React from 'react';
import { Vector3 } from 'three';
import { getNumArray } from '~/utils';
import { Parametric } from './parametric';
import { Body } from './body';


const IN_COLUMN_COUNT = 1;// all
const IN_ROW_COUNT = 240;// count in the row
const offset = { x: -IN_ROW_COUNT / 2, y: 0 };
const count = IN_COLUMN_COUNT * IN_ROW_COUNT;


export function Ground() {
    return (
        <group>
            {getNumArray(count).map(i => (
                <Body
                    connected={true}// connected to each other
                    bounceLine={offset.y}
                    mass={10000}
                    position={new Vector3(i + offset.x, offset.y, 0)}
                />
            ))}
        </group>
    );
}


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
