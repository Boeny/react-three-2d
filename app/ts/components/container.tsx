import * as React from 'react';
import { Vector3 } from 'three';
import { WidthEllipseRing } from './ring';


interface Props {
    position?: Vector3;
}

export function Container(props: Props) {
    return (
        <WidthEllipseRing
            radius={1}
            radius2={1}
            width={0.1}
            position={props.position}
        />
    );
}
