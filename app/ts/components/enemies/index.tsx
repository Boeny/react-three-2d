import * as React from 'react';
// import { observable } from 'mobx';
import { Position } from '~/types';
import { SmallTank } from './small-tank';


interface IStore {
    data: Position[];
}

export const Store: IStore = {
    data: [
        { x: -50, y: 25 },
        { x: 50, y: 25 },
        { x: 0, y: -50 }
    ]
};

export function Enemies() {
    return (
        <group name={'enemies'}>
            {Store.data.map((p, i) => (
                <SmallTank position={p} key={i} />
            ))}
        </group>
    );
}
