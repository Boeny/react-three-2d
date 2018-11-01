import * as React from 'react';
import { SmallTank } from './small-tank';


export function Enemies() {
    return (
        <group name={'enemies'}>
            <SmallTank position={{ x: 10, y: 5 }} />
            <SmallTank position={{ x: -10, y: 5 }} />
            <SmallTank position={{ x: 0, y: -10 }} />
        </group>
    );
}
