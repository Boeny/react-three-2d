import * as React from 'react';
import { Vector3 } from 'three';
import { Parametric } from '~/components';


export function Plane() {
    return (
        <Parametric
            slices={1}
            stacks={1}
            parametricFunction={pointOfPlane}
        />
    );
}

function pointOfPlane(u: number, v: number): Vector3 {
    return new Vector3(
        u * window.innerWidth,
        v * window.innerHeight / 2,
        0
    );
}
