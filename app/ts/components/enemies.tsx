import * as React from 'react';
import { Vector2 } from 'three';
import { getNumArray } from '~/utils';
import { Body } from './body';


export function Enemies() {
    return (
        <group>
            {getNumArray(1).map(i => (
                <Enemy key={i} />
            ))}
        </group>
    );
}

function Enemy() {
    return (
        <Body
            name={'enemy'}
            color={'red'}
            hasCollider={true}
            tail={true}
            position={new Vector2(20, 20)}
        />
    );
}
