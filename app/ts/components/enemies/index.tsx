import * as React from 'react';
import { SmallTank } from './small-tank';


const OFFSET = 70;

export function Enemies() {
    return (
        <group name={'enemies'}>
            <SmallTank name={'small1'} position={{ x: -OFFSET, y: OFFSET / 2 }} />
            <SmallTank name={'small2'} position={{ x: OFFSET, y: OFFSET / 2 }} />
            <SmallTank name={'small3'} position={{ x: 0, y: -OFFSET }} />
        </group>
    );
}
