import * as React from 'react';
import { SmallTank } from './small-tank';


export function Enemies() {
    return (
        <group name={'enemies'}>
            <SmallTank position={{ x: -50, y: 25 }} />
            <SmallTank position={{ x: 50, y: 25 }} />
            <SmallTank position={{ x: 0, y: -50 }} />
        </group>
    );
}
