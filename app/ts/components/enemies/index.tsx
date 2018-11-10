import * as React from 'react';
import { Enemy } from './enemy';


const OFFSET = 70;

export function Enemies() {
    return (
        <group name={'enemies'}>
            <Enemy name={'small1'} position={{ x: -OFFSET, y: OFFSET / 2 }} />
        </group>
    );
}
