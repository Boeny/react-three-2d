import * as React from 'react';
import { SmallTank } from './small-tank';


export function Enemies() {
    return (
        <group name={'enemies'}>
            <SmallTank />
        </group>
    );
}
