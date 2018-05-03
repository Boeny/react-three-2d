import * as React from 'react';
import { Vector3 } from 'three';
import { getNumArray } from '~/utils';
import { Body } from './body';


const IN_COLUMN_COUNT = 1;// all
const IN_ROW_COUNT = 240;// count in the row
const offset = { x: -IN_ROW_COUNT / 2, y: 0 };
const count = IN_COLUMN_COUNT * IN_ROW_COUNT;


export function Ground() {
    return (
        <group>
            {getNumArray(count).map(i => (
                <Body
                    mass={10000}
                    position={new Vector3(i + offset.x, offset.y, 0)}
                />
            ))}
        </group>
    );
}
/*
getNumArray(count).map(i => (
    <Body
        mass={10000}
        position={new Vector3(i + offset.x, offset.y, 0)}
    />
))
*/
