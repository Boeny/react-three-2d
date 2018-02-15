import * as React from 'react';
import { Vector3 } from 'three';
import { WidthEllipseRing } from './ring';


interface Props {
    radius: number;
    position?: Vector3;
}

export function Container(props: Props) {
    return (
        <WidthEllipseRing
            radius={props.radius}
            radius2={props.radius}
            width={0.1}
            position={props.position}
        />
    );
}
