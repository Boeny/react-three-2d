import * as React from 'react';
import { createArray } from '~/utils';
import { SmallTank } from './small-tank';
import { Union } from '../csg';


const RADIUS = 40;
const COUNT = 1;
const ANGLE = 2 * Math.PI / COUNT;


export function Enemies() {
    return (
        <Union components={createArray(COUNT).map(i => (
            <SmallTank
                key={i}
                name={`small${i}`}
                position={{
                    x: RADIUS * Math.cos(i * ANGLE),
                    y: RADIUS * Math.sin(i * ANGLE)
                }}
            />
        ))} />
    );
}
