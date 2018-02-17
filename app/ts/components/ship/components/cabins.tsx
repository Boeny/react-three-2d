import * as React from 'react';
import { Vector3 } from 'three';
import { WidthRing } from '~/components';
import { ARRAY_9 } from '~/constants';
import { CABIN_RADIUS, cabinLength } from '../constants';


interface CabinsProps {
    height: number;
    wholeLength: number;
}

export function BerthCabins(props: CabinsProps) {
    const { height, wholeLength } = props;
    return (
        <group position={new Vector3(0, height, 0)}>
            {ARRAY_9.map(i => (
                <BerthCabin key={i} index={i} wholeLength={wholeLength} />
            ))}
        </group>
    );
}


interface CabinProps {
    index: number;
    wholeLength: number;
}

function BerthCabin(props: CabinProps) {
    const { index, wholeLength } = props;
    const currentLength = index * cabinLength;
    return currentLength < wholeLength - CABIN_RADIUS * 2 ? (
        <WidthRing
            width={1}
            radius={CABIN_RADIUS}
            position={new Vector3(currentLength, 0, 0)}
        />
    ) : null;
}
