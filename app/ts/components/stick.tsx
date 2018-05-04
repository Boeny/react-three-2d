import * as React from 'react';
import { Vector2 } from 'three';
import { getNumArray } from '~/utils';
import { Body } from './body';


interface Props {
    length: number;
    getPosition: (i: number) => Vector2;
}

export function Stick(props: Props) {
    const { length, getPosition } = props;
    return (
        <group>
            {getNumArray(length).map(i => (
                <Body key={i} position={getPosition(i)} />
            ))}
        </group>
    );
}
