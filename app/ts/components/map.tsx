import * as React from 'react';
import { Vector3 } from 'three';
import { Quad } from './quad';


const POSITION = new Vector3();

export const Map = () => {
    return (
        <Quad
            position={POSITION}
            width={100}
            height={100}
            color={'green'}
        />
    );
};
