import * as React from 'react';
import { Vector3, Euler } from 'three';
import { pointInTheCircle } from '~/utils';
import { Parametric } from '~/components';
import { BerthCabins } from './cabins';
import { CORRIDOR_DEPTH, depth2, cabinPos } from '../constants';


interface Props extends PositionProps {
    start: number;
    end: number;
}

export function Corridor(props: Props) {
    const { start, end } = props;
    if (start > end) {
        console.warn('start position of the corridor must be less than the end position!');
        return null;
    }
    const position = props.position || new Vector3();
    const angle = props.angle || 0;
    const length = end - start;
    return (
        <group
            position={position.add(pointInTheCircle(start, angle))}
            rotation={new Euler(0, 0, angle)}
        >
            <Parametric
                slices={1}
                stacks={1}
                parametricFunction={(u, v) => pointInTheTube(u, v, length)}
            />
            <BerthCabins height={cabinPos} wholeLength={length} />
            <BerthCabins height={-cabinPos} wholeLength={length} />
        </group>
    );
}

function pointInTheTube(u: number, v: number, tubeLength: number): Vector3 {
    return new Vector3(
        u * tubeLength,
        v * CORRIDOR_DEPTH - depth2,
        0
    );
}
