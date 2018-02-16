import * as React from 'react';
import { Vector3, Euler } from 'three';
import { pointInTheCircle } from '~/utils';
import { WidthRing, Parametric } from '~/components';
import { ARRAY_9 } from '~/constants';
import { CORRIDOR_DEPTH, depth2, CABIN_RADIUS, cabinPos } from '../constants';


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
    const cabinLengthPart = length / 10;
    return (
        <group
            position={position.add(pointInTheCircle(start, angle))}
            rotation={new Euler(0, 0, angle || 0)}
        >
            <Parametric
                slices={40}
                stacks={1}
                parametricFunction={(u, v) => pointInTheTube(u * length, v * CORRIDOR_DEPTH - depth2)}
            />
            {ARRAY_9.map(i => (
                <BerthCabin key={i} position={new Vector3(i * cabinLengthPart, cabinPos, 0)}/>
            ))}
            {ARRAY_9.map(i => (
                <BerthCabin key={i} position={new Vector3(i * cabinLengthPart, -cabinPos, 0)}/>
            ))}
        </group>
    );
}

function pointInTheTube(r1: number, r2: number): Vector3 {
    return new Vector3(r1, r2, 0);
}

function BerthCabin(props: PositionProps) {
    return (
        <WidthRing
            width={1}
            radius={CABIN_RADIUS}
            {...props}
        />
    );
}
