import * as React from 'react';
import { Vector3 } from 'three';
import { WidthRing } from '../ring';


interface Props {
    radius: number;
    position?: Vector3;
    children?: any;
}

export function RollingCircle(props: Props) {
    return (
        <group>
            <WidthRing
                width={10}
                radius={props.radius + 10}
                position={props.position}
            />
            {props.children}
        </group>
    );
}
