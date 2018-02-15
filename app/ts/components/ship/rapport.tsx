import * as React from 'react';
import { Vector3 } from 'three';
import { WidthRing } from '../ring';


const rapportWidth = 5;

interface Props {
    radius: number;
    position?: Vector3;
}

export function Rapport(props: Props) {
    return (
        <WidthRing
            {...props}
            width={rapportWidth}
            color={'blue'}
        />
    );
}
