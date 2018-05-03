import * as React from 'react';
import { Vector3 } from 'three';
import { getNumArray } from '~/utils';
import { Body } from './body';
import { GRAVITY_FORCE } from '~/constants';


interface Props {
    length: number;
    getPosition: (i: number) => Vector3;
    mass?: number;
}

export function Stick(props: Props) {
    const { length, getPosition } = props;
    const mass = props.mass ? props.mass / length : 1;
    return (
        <group>
            {getNumArray(length).map(i => (
                <Body
                    mass={mass}
                    position={getPosition(i)}
                    force={GRAVITY_FORCE}
                />
            ))}
        </group>
    );
}
